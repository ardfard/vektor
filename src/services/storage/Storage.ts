import type { Effect } from "effect"
import type { ParsedPath } from "path"

export class StorageError extends Error {
  readonly _tag = "StorageError"
  constructor(message: string, readonly cause?: unknown) {
    super(message, { cause })
  }
}

export interface IStorageService {
  uploadFile: (
    destinationPath: ParsedPath,
    body: Buffer
  ) => Effect.Effect<void, StorageError>
}
