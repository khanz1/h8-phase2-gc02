import * as z from "zod"
import { CompleteNews_Article, RelatedNews_ArticleModel } from "./index"

export const News_CategoryModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteNews_Category extends z.infer<typeof News_CategoryModel> {
  Articles: CompleteNews_Article[]
}

/**
 * RelatedNews_CategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNews_CategoryModel: z.ZodSchema<CompleteNews_Category> = z.lazy(() => News_CategoryModel.extend({
  Articles: RelatedNews_ArticleModel.array(),
}))
