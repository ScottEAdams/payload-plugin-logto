import { Request } from 'express'
import { Strategy } from 'passport'
import { Payload } from 'payload'
import { PaginatedDocs } from 'payload/dist/mongoose/types'
import { pino } from 'pino'

import { makeRandomPassword } from './utils'
import { UserDocument } from 'payload/auth'
import { RequestContext } from 'express-openid-connect'

interface OidcUser extends UserDocument {
	sub: string
	email: string
	name?: string
	picture?: string
	username?: string
	roles?: string[]
	phone_number?: string
}

export class LogtoStrategy extends Strategy {
	payload: Payload
	readonly slug: string
	logger: pino.Logger
	public name = 'logto'

	constructor(payload: Payload) {
		super()
		this.payload = payload
		this.logger = this.payload.logger.child({
			strategy: this.name
		})
		this.slug = payload?.collections?.[payload?.config?.admin?.user]?.config?.slug || 'users'
	}

	createUser(oidcUser: OidcUser): Promise<any> {
		oidcUser.username = oidcUser?.username || oidcUser?.name
		return this.payload.create({
			collection: this.slug,
			data: {
				...oidcUser,
				password: makeRandomPassword()
			}
		})
	}

	findUser(oidcUser: OidcUser): Promise<PaginatedDocs<any>> {
		const params: any[] = [{ sub: { equals: oidcUser.sub } }]
		if (oidcUser.email) {
			params.push({ email: { equals: oidcUser?.email } })
		}
		const query = { or: params }

		return this.payload.find({
			collection: this.slug,
			where: query
		})
	}

	async mergeUsers(foundUser: UserDocument, oidcUser: OidcUser): Promise<void> {
		// TODO: add extra fields logic such as username/name
		// oidcUser.username = oidcUser?.username || oidcUser?.name
		const doc = await this.payload.update({
			collection: this.slug,
			id: foundUser.id,
			data: {
				...oidcUser
			}
		})
		this.successCallback(doc)
	}

	successCallback(user: any): void {
		user.collection = this.slug
		user._strategy = `${this.slug}-${this.name}`
		this.success(user)
	}

	async authenticate(req: Request, options?: any): Promise<any> {
		const oidc = req?.oidc as RequestContext
		if (oidc?.user) {
			const oidcUser = { ...oidc.user } as OidcUser
			if (!oidcUser.email) {
				const err = new Error('email is empty')
				this.error(err)
				return Promise.resolve(err)
			}
			const collection = await this.findUser(oidcUser)
			if (collection.docs && collection.docs.length) {
				const doc = collection.docs[0]
				await this.mergeUsers(doc, oidcUser)
				return
			}
			const doc = await this.createUser(oidcUser)
			this.successCallback(doc)
			return
		}
		const err = new Error('No logto auth')
		this.error(err)
	}
}
