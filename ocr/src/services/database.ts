import { Effect, Context, Layer } from "effect"
import { DatabaseService, DatabaseError } from "../types"

// Implementation of the DatabaseService
class DatabaseServiceImpl implements DatabaseService {
  readonly _tag = 'DatabaseService'

  query(sql: string): Effect.Effect<never, DatabaseError, string[]> {
    // This is just a mock implementation
    return Effect.succeed(['mock result'])
  }
}

// Create a Context for the DatabaseService
export const DatabaseServiceTag = Context.Tag<DatabaseService>("DatabaseService")

// Create a live implementation of the service
export const DatabaseServiceLive = Layer.succeed(
  DatabaseServiceTag,
  new DatabaseServiceImpl()
) 