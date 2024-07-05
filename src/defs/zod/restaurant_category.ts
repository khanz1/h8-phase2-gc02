import * as z from "zod"
import { CompleteRestaurant_Cuisine, RelatedRestaurant_CuisineModel } from "./index"

export const Restaurant_CategoryModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRestaurant_Category extends z.infer<typeof Restaurant_CategoryModel> {
  Cuisines: CompleteRestaurant_Cuisine[]
}

/**
 * RelatedRestaurant_CategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRestaurant_CategoryModel: z.ZodSchema<CompleteRestaurant_Category> = z.lazy(() => Restaurant_CategoryModel.extend({
  Cuisines: RelatedRestaurant_CuisineModel.array(),
}))
