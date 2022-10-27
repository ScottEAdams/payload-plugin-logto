import React from 'react'
import { useFormFields } from 'payload/components/forms'

const PictureField = () => {
	const picture = useFormFields(([fields]) => fields.picture)
	return picture?.value && <img src={picture.value as string} />
}

export default PictureField
