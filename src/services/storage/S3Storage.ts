import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Effect } from "effect"
import type { ParsedPath } from "path"
import * as path from "path"
import type { IStorageService } from "./Storage.js"
import { StorageError } from "./Storage.js"

export interface S3StorageConfig {
  type: "s3"
  bucket: string
  region: string
  endpoint?: string
}

export class S3StorageService implements IStorageService {
  readonly _tag = "S3StorageService"
  readonly config: S3StorageConfig
  readonly client: S3Client

  constructor(config: S3StorageConfig) {
    this.config = config
    this.client = new S3Client({
      region: this.config.region,
      ...(this.config.endpoint ? { endpoint: this.config.endpoint } : {})
    })
  }

  uploadFile(parsedPath: ParsedPath, body: Buffer) {
    return Effect.tryPromise({
      try: async () => {
        const key = path.join(parsedPath.dir, parsedPath.base)
        await this.client.send(
          new PutObjectCommand({
            Bucket: this.config.bucket,
            Key: key,
            Body: body
          })
        )
      },
      catch: (error) => new StorageError(`Failed to upload file`, error)
    })
  }
}
