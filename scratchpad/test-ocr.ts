import { FileSystem } from "@effect/platform"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Effect } from "effect"
import * as path from "path"
import { OCRService } from "../src/services/ocr/index.js"

const ocr = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem
  const buffer = yield* fs.readFile(path.join(__dirname, "..", "test.pdf"))
  const ocrService = yield* OCRService
  const result = yield* ocrService.process(
    Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength),
    `{
      "name": "string",
      "age": "number",
      "email": "string"
    }`,
    "application/pdf"
  )
  yield* Effect.log(result)
})

BunRuntime.runMain(
  ocr.pipe(
    Effect.provide(OCRService.Default),
    Effect.provide(BunContext.layer)
  )
)
