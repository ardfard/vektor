import { Effect } from "effect"
import * as fs from "fs/promises"
import type { ParsedPath } from "path"
import * as path from "path"
import type { IStorageService } from "./Storage.js"
import { StorageError } from "./Storage.js"

export interface LocalStorageConfig {
  type: "local"
  basePath: string
}

export class LocalStorageService implements IStorageService {
  readonly _tag = "LocalStorageService"
  readonly config: LocalStorageConfig

  constructor(config: LocalStorageConfig) {
    this.config = config
  }

  uploadFile(parsedPath: ParsedPath, body: Buffer) {
    console.log(parsedPath)
    const filePath = path.join(this.config.basePath, parsedPath.dir, parsedPath.base)
    return Effect.tryPromise({
      try: async () => {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, body)
      },
      catch: (error) => new StorageError(`Failed to upload file`, error)
    })
  }
}
