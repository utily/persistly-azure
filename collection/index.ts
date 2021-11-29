import * as gracely from "gracely"
import * as model from "persistly-model"
import * as node from "persistly-node"
import * as servly from "servly"
import * as azure from "servly-azure"
import * as service from "../service"

export const endpoint = servly.Endpoint.create(async (context, request) => {
	let result:
		| {
				command: model.Command<any>
				result: any
		  }[]
		| gracely.Error
	const key = await authorize(request.header.authorization)
	const collections = key && node.Collections.connect(key.connection, key.configuration)
	const body = await request.body
	if (!collections)
		result = gracely.client.unauthorized()
	else if (!Array.isArray(body) || !body.every(model.Command.is))
		result = gracely.client.invalidContent("persistly-model.Command[]", "Input must be a body of persistly Commands.")
	else {
		// const collections = node.Connection.open("").get("").then(c => c.) //node.Update.extract()
		result = []
		for await (const command of body) {
			result.push({ command, result: await collections.get(command.request) })
		}
	}
	return result
})

export const run = azure.eject(endpoint)

async function authorize(authorization: string | undefined): Promise<model.Key | undefined> {
	return service.Verifier.apiKey?.verify(authorization?.startsWith("Bearer ") ? authorization.substring(7) : undefined)
}
