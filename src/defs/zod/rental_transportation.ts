import * as z from "zod"
import { CompleteRental_Type, RelatedRental_TypeModel, CompleteUser, RelatedUserModel } from "./index"

export const Rental_TransportationModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  description: z.string().trim().min(1, { message: "must not be empty" }),
  imgUrl: z.string().nullish(),
  location: z.string().nullish(),
  price: z.number().int().min(1),
  typeId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRental_Transportation extends z.infer<typeof Rental_TransportationModel> {
  Type: CompleteRental_Type
  User: CompleteUser
}

/**
 * RelatedRental_TransportationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRental_TransportationModel: z.ZodSchema<CompleteRental_Transportation> = z.lazy(() => Rental_TransportationModel.extend({
  Type: RelatedRental_TypeModel,
  User: RelatedUserModel,
}))
