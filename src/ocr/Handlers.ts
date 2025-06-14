import type { Multipart } from "@effect/platform"
import { FileSystem } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { Effect } from "effect"
import { OCRService } from "./index.js"

export function process(file: Multipart.PersistedFile, spec: string) {
  return Effect.gen(function*() {
    const ocrService = yield* OCRService

    const fs = yield* FileSystem.FileSystem
    const buf = yield* fs.readFile(file.path).pipe(
      Effect.map((buf) => Buffer.from(buf)),
      Effect.mapError(
        (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
      )
    )
    const result = yield* ocrService.process(buf, spec, file.contentType)
    return result
  }).pipe(
    Effect.mapError(
      (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
    )
  )
}
