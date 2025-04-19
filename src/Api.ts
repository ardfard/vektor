import {
  FileSystem,
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
  Multipart
} from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { Console, Effect, Layer, Schema } from "effect"
import type { ParsedPath } from "path"
import * as path from "path"
import { OCRService } from "./services/ocr/index.js"
import { StorageService } from "./services/storage/index.js"

const StorageApi = HttpApiGroup.make("storage").add(
  HttpApiEndpoint.post("upload")`/uploads`
    .setPayload(
      HttpApiSchema.Multipart(
        Schema.Struct({
          file: Multipart.SingleFileSchema
        })
      )
    )
    .addSuccess(Schema.String)
)

const ProcessDocumentApi = HttpApiGroup.make("process-document").add(
  HttpApiEndpoint.post("process-document")`/process-document`
    .setPayload(
      HttpApiSchema.Multipart(
        Schema.Struct({
          jsonSpec: Schema.String,
          file: Multipart.SingleFileSchema
        })
      )
    )
    .addSuccess(Schema.String)
)

const Api = HttpApi.make("Vektor").add(StorageApi).add(ProcessDocumentApi)

export const uploadingFile = (path: ParsedPath, content: Buffer) =>
  Effect.gen(function*() {
    const storageService = yield* StorageService
    yield* storageService.uploadFile(path, content)
  })

const StorageApiLive = HttpApiBuilder.group(
  Api,
  "storage",
  (handlers) =>
    handlers.handle("upload", ({ payload: { file } }) =>
      Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem
        const _path = path.parse("text")

        const buf = yield* fs.readFile(file.path).pipe(
          Effect.flatMap((buf) => uploadingFile(_path, Buffer.from(buf))),
          Effect.mapError(
            (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
          )
        )
        yield* Console.log(buf)
        return "upload success"
      }).pipe(
        Effect.mapError(
          (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
        )
      ))
)

const ProcessDocumentApiLive = HttpApiBuilder.group(
  Api,
  "process-document",
  (handlers) =>
    handlers.handle("process-document", ({ payload: { file, jsonSpec } }) =>
      Effect.gen(function*() {
        const ocrService = yield* OCRService

        const fs = yield* FileSystem.FileSystem
        const buf = yield* fs.readFile(file.path).pipe(
          Effect.map((buf) => Buffer.from(buf)),
          Effect.mapError(
            (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
          )
        )
        const result = yield* ocrService.process(buf, jsonSpec, file.contentType)
        return result
      }).pipe(
        Effect.mapError(
          (e) => new HttpApiDecodeError({ message: String(e), issues: [] })
        )
      ))
)

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(StorageApiLive),
  Layer.provide(ProcessDocumentApiLive)
)
