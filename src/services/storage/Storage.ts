import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Context, Effect, Layer } from "effect"
import * as fs from "fs/promises"
import type { ParsedPath } from "path"
import * as path from "path"
import { StorageConfigContext } from "./Config.js"

export class StorageError extends Error {
  readonly _tag = "StorageError"
  constructor(message: string, readonly cause?: unknown) {
    super(message, { cause })
  }
}

// Tag for the service
export class StorageService extends Context.Tag("StorageService")<StorageService, {
  uploadFile: (
    path: ParsedPath,
    body: Buffer
  ) => Effect.Effect<void, StorageError>
}>() {}

export const LiveStorage = Layer.effect(
  StorageService,
  Effect.gen(function*(_) {
    const config = yield* StorageConfigContext

    switch (config.type) {
      case "local": {
        return {
          uploadFile: (parsedPath: ParsedPath, body: Buffer) =>
            Effect.gen(function*() {
              const filePath = path.join(config.basePath, parsedPath.dir, parsedPath.base)
              yield* Effect.tryPromise({
                try: async () => {
                  await fs.mkdir(path.dirname(filePath), { recursive: true })
                  await fs.writeFile(filePath, body)
                },
                catch: (error) => new StorageError(`Failed to upload file`, error)
              })
            })
        }
      }
      case "s3": {
        const client = new S3Client({
          region: config.region,
          ...(config.endpoint ? { endpoint: config.endpoint } : {})
        })

        return {
          uploadFile: (parsedPath: ParsedPath, body: Buffer) =>
            Effect.tryPromise({
              try: async () => {
                const key = path.join(parsedPath.dir, parsedPath.base)
                await client.send(
                  new PutObjectCommand({
                    Bucket: config.bucket,
                    Key: key,
                    Body: body
                  })
                )
              },
              catch: (error) => new StorageError(`Failed to upload file`, error)
            })
        }
      }
      default: {
        // exhaustiveness check
        const exhaustiveCheck: never = config
        throw new StorageError(`Unsupported storage type: ${exhaustiveCheck}`)
      }
    }
  })
)
