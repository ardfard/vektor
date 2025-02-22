import { Effect, Console } from "effect"

const program = Console.log("Hello, world!")

Effect.runSync(program)
