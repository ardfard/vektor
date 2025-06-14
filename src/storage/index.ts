import { Context, Effect, Layer } from "effect"
import type { LocalStorageConfig } from "./LocalStorage.js"
import { LocalStorageService } from "./LocalStorage.js"
import type { S3StorageConfig } from "./S3Storage.js"
import { S3StorageService } from "./S3Storage.js"
import type { IStorageService } from "./Storage.js"
import { StorageError } from "./Storage.js"

type StorageConfig = LocalStorageConfig | S3StorageConfig

// Tag for the config
class StorageConfigContext extends Context.Tag("StorageConfig")<StorageConfigContext, StorageConfig>() {}

// Tag for the service
class StorageService extends Context.Tag("StorageService")<StorageService, IStorageService>() {}

const StorageServiceLive = Layer.effect(
  StorageService,
  Effect.gen(function*(_) {
    const config = yield* StorageConfigContext

    switch (config.type) {
      case "local": {
        return new LocalStorageService(config)
      }
      case "s3": {
        return new S3StorageService(config)
      }
      default: {
        // exhaustiveness check
        const exhaustiveCheck: never = config
        throw new StorageError(`Unsupported storage type: ${exhaustiveCheck}`)
      }
    }
  })
)

// re-export the service
export { StorageConfigContext, StorageService, StorageServiceLive }

export type { LocalStorageConfig, S3StorageConfig, StorageConfig }
