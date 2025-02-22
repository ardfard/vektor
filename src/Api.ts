import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Effect, Layer, Schema } from "effect"

const StorageApi = HttpApiGroup.make("storage").add(
  HttpApiEndpoint.get("upload")`/uploads`.addSuccess(Schema.String)
)

const Api = HttpApi.make("Vektor").add(StorageApi)

const StorageApiLive = HttpApiBuilder.group(
  Api,
  "storage",
  (handlers) => handlers.handle("upload", () => Effect.succeed("upload success"))
)

export const ApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(StorageApiLive))
