import { GoogleGenerativeAI } from "@google/generative-ai"
import { readFileSync } from "fs"
import type { GoogleGenAIConfig } from "./Config.js"

async function processFile(content: Buffer, mimeType: string, config: GoogleGenAIConfig) {
  const generativeAi = new GoogleGenerativeAI(config.apiKey)
  const model = generativeAi.getGenerativeModel({
    model: "gemini-1.5-flash"
  })

  const response = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: content.toString("base64")
      }
    },
    "extract the structured data and return it in JSON format"
  ])

  const result = await response.response.text()

  return result
}

const res = await processFile(readFileSync("test.pdf"), "application/pdf", {
  type: "google-genai",
  apiKey: "AIzaSyCwhJUsGlN8etI_pDGqqLI1KW1P4uDntEo"
})

console.log(res)
