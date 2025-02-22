import { Effect, Layer } from "effect"
import * as path from "path"
import { StorageConfigContext } from "../src/services/storage/Config.js"
import { LiveStorage, StorageService } from "../src/services/storage/Storage.js"

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

const layer = LiveStorage.pipe(Layer.provide(configLayer))

const exit = await Effect.runPromiseExit(
  upload.pipe(
    Effect.provide(layer)
  )
)

console.log(exit)
