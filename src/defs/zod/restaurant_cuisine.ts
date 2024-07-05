import * as z from "zod"
import { CompleteRestaurant_Category, RelatedRestaurant_CategoryModel, CompleteUser, RelatedUserModel } from "./index"

export const Restaurant_CuisineModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  description: z.string().trim().min(1, { message: "must not be empty" }),
  price: z.number().int().min(1),
  imgUrl: z.string(),
  categoryId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteRestaurant_Cuisine extends z.infer<typeof Restaurant_CuisineModel> {
  Category: CompleteRestaurant_Category
  User: CompleteUser
}

/**
 * RelatedRestaurant_CuisineModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRestaurant_CuisineModel: z.ZodSchema<CompleteRestaurant_Cuisine> = z.lazy(() => Restaurant_CuisineModel.extend({
  Category: RelatedRestaurant_CategoryModel,
  User: RelatedUserModel,
}))
