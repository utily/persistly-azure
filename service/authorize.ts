import * as model from "persistly-model"

export async function authorize(authorization: string | undefined): Promise<model.Key | undefined> {
	return await model.Key.Verifier.create(process.env.apiKeySecret)?.verify(
		authorization?.startsWith("Bearer ") ? authorization.substring(7) : undefined
	)
}
