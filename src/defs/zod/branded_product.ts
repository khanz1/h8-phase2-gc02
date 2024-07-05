import * as z from "zod"
import { CompleteBranded_Category, RelatedBranded_CategoryModel, CompleteUser, RelatedUserModel } from "./index"

export const Branded_ProductModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  description: z.string().trim().min(1, { message: "must not be empty" }),
  price: z.number().int().min(1),
  stock: z.number().int().nullish(),
  imgUrl: z.string().nullish(),
  categoryId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteBranded_Product extends z.infer<typeof Branded_ProductModel> {
  Category: CompleteBranded_Category
  User: CompleteUser
}

/**
 * RelatedBranded_ProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBranded_ProductModel: z.ZodSchema<CompleteBranded_Product> = z.lazy(() => Branded_ProductModel.extend({
  Category: RelatedBranded_CategoryModel,
  User: RelatedUserModel,
}))
