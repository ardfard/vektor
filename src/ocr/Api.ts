import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, Multipart } from "@effect/platform"
import { Schema } from "effect"

export class OCRApi extends HttpApiGroup.make("ocr")
  .add(
    HttpApiEndpoint.post("process")`/process`
      .setPayload(
        HttpApiSchema.Multipart(
          Schema.Struct({
            spec: Schema.String,
            file: Multipart.SingleFileSchema
          })
        )
      )
      .addSuccess(Schema.Object)
  )
{}
