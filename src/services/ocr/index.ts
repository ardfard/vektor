import { Effect } from "effect"
import { OCRConfigContext, OCRConfigContextLive } from "./Config.js"
import { OCRServiceImpl } from "./ocr.js"

export class OCRService extends Effect.Service<OCRService>()(
  "OCRService",
  {
    effect: Effect.gen(function*() {
      const config = yield* OCRConfigContext
      const ocrService = new OCRServiceImpl(config)
      return ocrService
    }),
    dependencies: [OCRConfigContextLive]
  }
) {}
