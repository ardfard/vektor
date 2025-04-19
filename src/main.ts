import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Console, Effect, Layer } from "effect"
import { ApiLive } from "./Api.js"
import { OCRService } from "./services/ocr/index.js"
import { StorageConfigContext, StorageServiceLive } from "./services/storage/index.js"

const configLayer = Layer.succeed(StorageConfigContext, {
  type: "local",
  basePath: "uploads"
})

const server = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  Layer.provide(StorageServiceLive.pipe(Layer.provide(configLayer))),
  Layer.provide(OCRService.Default),
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
)

Effect.gen(function*() {
  yield* Console.log("Starting server at http://localhost:3000")
  yield* Layer.launch(server)
}).pipe(BunRuntime.runMain)
