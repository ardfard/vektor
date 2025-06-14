import { Config, Context, Effect, Layer } from "effect"

interface GoogleGenAIConfig {
  type: "google-genai"
  apiKey: string
}

export type OCRConfig = GoogleGenAIConfig

export class OCRConfigContext extends Context.Tag("OCRConfigContext")<OCRConfigContext, OCRConfig>() {}

export const OCRConfigContextLive = Layer.effect(
  OCRConfigContext,
  Effect.gen(function*() {
    const apiKey = yield* Config.string("GOOGLE_GENAI_API_KEY")
    return {
      type: "google-genai",
      apiKey
    } as const
  })
)
