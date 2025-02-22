import { Context } from "effect"

export interface GoogleGenAIConfig {
  type: "google-genai"
  apiKey: string
}

export type OCRConfig = GoogleGenAIConfig

export class OCRConfigContext extends Context.Tag("OCRConfigContext")<OCRConfigContext, OCRConfig>() {}
