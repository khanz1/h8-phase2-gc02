import * as z from "zod"
import { CompleteRental_Transportation, RelatedRental_TransportationModel } from "./index"

export const Rental_TypeModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRental_Type extends z.infer<typeof Rental_TypeModel> {
  Transportations: CompleteRental_Transportation[]
}

/**
 * RelatedRental_TypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRental_TypeModel: z.ZodSchema<CompleteRental_Type> = z.lazy(() => Rental_TypeModel.extend({
  Transportations: RelatedRental_TransportationModel.array(),
}))
