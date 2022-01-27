import * as model from "persistly-model"
import { default as order } from "./order.json"

export function getTestData(body: model.Command<model.Document>[]): Record<string, any> {
	const result: Record<string, any> = {}
	body.forEach(i => (result[i.name] = get(i.name)))
	return result
}

export function get<T extends { [property: string]: any }>(name: string): T[] {
	let result: { [property: string]: any }[]
	switch (name) {
		case "order":
			result = order
			break
		default:
			result = []
			break
	}
	return result as T[]
}
