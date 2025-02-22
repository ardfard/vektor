import { Effect } from "effect"

// Example of a custom error
export class DatabaseError {
  readonly _tag = 'DatabaseError'
  constructor(readonly message: string) {}
}

// Example service interface
export interface DatabaseService {
  readonly _tag: 'DatabaseService'
  query: (sql: string) => Effect.Effect<never, DatabaseError, string[]>
} 