import { Payload } from 'payload'
import { Config } from 'payload/config'

import LogoutButton from '../components/LogoutButton'

import fields from './fields'
import { LogtoStrategy } from './strategy'
import { addAfterNavLinks, addFieldsToCollection, addStrategyToCollection } from './utils'

const logto =
	() =>
	(incomingConfig: Config): Config => {
		let config: Config = {
			...incomingConfig
		}

		// add the strategy
		const userSlug = config?.admin?.user || 'users'
		config.collections = config?.collections?.map((collectionConfig) => {
			if (collectionConfig.slug === userSlug) {
				collectionConfig = addFieldsToCollection(collectionConfig, fields)
				const strategy = {
					strategy: (ctx: Payload) => {
						return new LogtoStrategy(ctx)
					},
					name: LogtoStrategy.name
				}
				collectionConfig = addStrategyToCollection(collectionConfig, strategy)
			}
			return collectionConfig
		})

		// add the components
		config = addAfterNavLinks(config, LogoutButton)

		return config
	}

export default logto
