import * as z from "zod"
import { CompleteRoom_Type, RelatedRoom_TypeModel, CompleteUser, RelatedUserModel } from "./index"

export const Room_LodgingModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  facility: z.string().trim().min(1, { message: "must not be empty" }),
  roomCapacity: z.number().int(),
  imgUrl: z.string().url(),
  location: z.string(),
  typeId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRoom_Lodging extends z.infer<typeof Room_LodgingModel> {
  Type: CompleteRoom_Type
  User: CompleteUser
}

/**
 * RelatedRoom_LodgingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoom_LodgingModel: z.ZodSchema<CompleteRoom_Lodging> = z.lazy(() => Room_LodgingModel.extend({
  Type: RelatedRoom_TypeModel,
  User: RelatedUserModel,
}))
