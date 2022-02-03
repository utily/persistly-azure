import * as gracely from "gracely"
import * as model from "persistly-model"
import * as node from "persistly-node"
import * as servly from "servly"
import * as azure from "servly-azure"
import * as service from "../service"

export const endpoint = servly.Endpoint.create(async (context, request) => {
	let result: model.Command<any>[] | gracely.Error
	const key = await service.authorize(request.header.authorization)
	const body = await request.body
	let collections: node.Collections
	if (!key)
		result = gracely.client.unauthorized()
	else if (!Array.isArray(body) || !body.every(c => model.Command.is<model.Document>(c)))
		result = gracely.client.invalidContent("persistly-model.Command[]", "Input must be a body of persistly Commands.")
	else if (
		!(collections = node.Collections.connect(
			key.connection != "test" ? key.connection : service.data.getTestData(body),
			key.configuration
		))
	)
		result = gracely.server.misconfigured("db", "Database connection string is missing.")
	else {
		result = []
		for (const command of body) {
			const collection = await collections.get(command.name)

			switch (command.command) {
				case "list":
					command.response = (await collection?.list(command.request)) ?? []
					break
				case "create":
					command.response = await collection?.create(command.request)
					break
				case "get":
					command.response = await collection?.get(command.request)
					break
				case "update":
					command.response = await collection?.update(command.request)
					break
				case "delete":
					command.response = await collection?.delete(command.request)
					break
			}
			result.push(command)
		}
	}
	return result
})

export const run = azure.eject(endpoint)
