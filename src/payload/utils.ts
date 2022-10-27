import crypto from 'crypto'

import React from 'react'
import { Config } from 'payload/config'
import { CollectionConfig } from 'payload/types'

export const makeRandomPassword = (length = 20) => {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
	return Array.from(crypto.randomFillSync(new Uint32Array(length)))
		.map((x) => characters[x % characters.length])
		.join('')
}

export const addStrategyToCollection = (collectionConfig: CollectionConfig, strategy: any) => {
	if (!collectionConfig?.auth || typeof collectionConfig.auth === 'boolean') {
		collectionConfig.auth = {}
	}
	const existingStrategies = collectionConfig?.auth?.strategies || []
	collectionConfig.auth.strategies = [...existingStrategies, strategy]
	return collectionConfig
}

export const addFieldsToCollection = (collectionConfig: CollectionConfig, fields: any) => {
	const existingFields = collectionConfig?.fields || []
	collectionConfig.fields = [...existingFields, ...fields]
	return collectionConfig
}

export const addAfterNavLinks = (config: Config, component: React.ComponentType<any>) => {
	if (!config?.admin) {
		config.admin = {}
	}
	if (!config?.admin?.components) {
		config.admin.components = {}
	}
	const existingComponents = config?.admin?.components?.afterNavLinks || []
	config.admin.components.afterNavLinks = [...existingComponents, component]
	return config
}
