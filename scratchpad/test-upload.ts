import { Effect, Layer } from "effect"
import * as path from "path"
import { StorageConfigContext, StorageService, StorageServiceLive } from "../src/services/storage/index.js"

const upload = Effect.gen(function*() {
  const storage = yield* StorageService
  yield* storage.uploadFile(
    path.parse("./test.txt"),
    Buffer.from("Hello, world!!")
  )
})

const configLayer = Layer.succeed(
  StorageConfigContext,
  {
    type: "local" as const,
    basePath: "./"
  }
)

const layer = StorageServiceLive.pipe(Layer.provide(configLayer))

const exit = await Effect.runPromiseExit(
  upload.pipe(
    Effect.provide(layer)
  )
)

console.log(exit)
