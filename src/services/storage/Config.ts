import { Context } from "effect"

interface LocalStorageConfig {
  type: "local"
  basePath: string
}

interface S3StorageConfig {
  type: "s3"
  bucket: string
  region: string
  endpoint?: string
}

type StorageConfig = LocalStorageConfig | S3StorageConfig

export class StorageConfigContext extends Context.Tag("StorageConfig")<StorageConfigContext, StorageConfig>() {
}
