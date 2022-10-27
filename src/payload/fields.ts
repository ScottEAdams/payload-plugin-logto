import PictureField from '../components/PictureField'

const fields = [
	{
		name: 'picture',
		type: 'text',
		admin: {
			hidden: true,
			condition: (data: any) => {
				return data.picture
			}
		}
	},
	{
		name: 'pictureVisual',
		type: 'ui',
		admin: {
			position: 'sidebar',
			condition: (_: any, siblingData: any) => {
				return siblingData.picture
			},
			components: {
				Field: PictureField,
				Cell: PictureField
			}
		}
	},
	{
		name: 'sub',
		type: 'text',
		admin: {
			readOnly: true,
			condition: (data: any) => {
				return data.sub
			}
		}
	}
]

export default fields
