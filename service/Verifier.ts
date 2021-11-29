import * as authly from "authly"
import * as model from "persistly-model"
// import * as node from "persistly-node"

export abstract class Verifier {
	static apiKey: authly.Verifier<model.Key> | undefined
	static initialize(env: Record<string, any>) {
		this.apiKey = model.Key.Verifier.create(env.apiKeySecret)
	}
}
