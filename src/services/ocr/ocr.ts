import { GoogleGenerativeAI } from "@google/generative-ai"
import { Effect } from "effect"
import type { OCRConfig } from "./Config.js"

export class OCRServiceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message, { cause })
  }
}

export interface IOCRService {
  process(content: Buffer, mimeType: string): Effect.Effect<string, OCRServiceError>
}

export class OCRServiceImpl implements IOCRService {
  readonly config: OCRConfig

  constructor(config: OCRConfig) {
    this.config = config
  }

  process(content: Buffer, mimeType: string) {
    const apiKey = this.config.apiKey
    const generativeAi = new GoogleGenerativeAI(apiKey)
    const model = generativeAi.getGenerativeModel({
      model: "gemini-1.5-flash"
    })

    return Effect.tryPromise(() =>
      model.generateContent([
        {
          inlineData: {
            mimeType,
            data: content.toString("base64")
          }
        },
        "extract the structured data and return it in JSON format"
      ])
    ).pipe(
      Effect.tap((result) => Effect.log(result)),
      Effect.map((result) => result.response.text()),
      Effect.catchAll((e) => Effect.fail(new OCRServiceError(e.message)))
    )
  }
}
