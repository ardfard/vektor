import { GoogleGenerativeAI } from "@google/generative-ai"
import { Effect } from "effect"
import type { OCRConfig } from "./Config.js"

export class OCRServiceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message, { cause })
  }
}

export interface IOCRService {
  process(content: Buffer, jsonSpec: string, mimeType: string): Effect.Effect<object, OCRServiceError>
}

export class OCRServiceImpl implements IOCRService {
  readonly config: OCRConfig

  constructor(config: OCRConfig) {
    this.config = config
  }

  process(content: Buffer, jsonSpec: string, mimeType: string) {
    const apiKey = this.config.apiKey
    const generativeAi = new GoogleGenerativeAI(apiKey)
    const model = generativeAi.getGenerativeModel({
      model: "gemini-2.0-flash-lite"
    })

    return Effect.gen(function*() {
      const result = yield* Effect.tryPromise({
        try: () =>
          model.generateContent([
            {
              inlineData: {
                mimeType,
                data: content.toString("base64")
              }
            },
            `extract the structured data and return it in JSON format, the json spec is:\n ${jsonSpec}. Always return the raw JSON object, do not include any other text.`
          ]),
        catch: (error) => new OCRServiceError(`Failed to process OCR: ${error}`)
      })
      yield* Effect.log(result.response.text())
      // Clean the response text: remove markdown code fences and language identifier
      const rawText = result.response.text()
      let cleanedText = rawText.replace(/^\s*```json\s*/i, "") // Remove ```json prefix (case-insensitive)
      cleanedText = cleanedText.replace(/\s*```\s*$/, "") // Remove ``` suffix
      cleanedText = cleanedText.trim() // Trim final whitespace
      yield* Effect.log(`Cleaned Text: ${cleanedText}`) // Log cleaned text for debugging
      return JSON.parse(cleanedText) // Parse the cleaned text
    })
  }
}
