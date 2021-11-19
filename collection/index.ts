import * as servly from "servly"
import * as azure from "servly-azure"

export const endpoint = servly.Endpoint.create(async (context, request) => {
	const connection = authorize(request.header.authorization)
	const collection = 
	let result = any
	if (!connection)
		result = gracely.client.unauthorized()

	return result
})

export const run = azure.eject(endpoint)

function authorize(authorization: string | undefined): string | undefined {
	return authorization?.startsWith("Bearer ") ? authorization.substring(7) : undefined
}
