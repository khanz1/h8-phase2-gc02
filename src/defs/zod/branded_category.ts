import * as z from "zod"
import { CompleteBranded_Product, RelatedBranded_ProductModel } from "./index"

export const Branded_CategoryModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteBranded_Category extends z.infer<typeof Branded_CategoryModel> {
  Products: CompleteBranded_Product[]
}

/**
 * RelatedBranded_CategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBranded_CategoryModel: z.ZodSchema<CompleteBranded_Category> = z.lazy(() => Branded_CategoryModel.extend({
  Products: RelatedBranded_ProductModel.array(),
}))
