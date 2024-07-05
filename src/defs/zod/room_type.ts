import * as z from "zod"
import { CompleteRoom_Lodging, RelatedRoom_LodgingModel } from "./index"

export const Room_TypeModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRoom_Type extends z.infer<typeof Room_TypeModel> {
  Lodgings: CompleteRoom_Lodging[]
}

/**
 * RelatedRoom_TypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoom_TypeModel: z.ZodSchema<CompleteRoom_Type> = z.lazy(() => Room_TypeModel.extend({
  Lodgings: RelatedRoom_LodgingModel.array(),
}))
