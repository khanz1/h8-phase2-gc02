import * as z from "zod"
import { CompleteNews_Category, RelatedNews_CategoryModel, CompleteUser, RelatedUserModel } from "./index"

export const News_ArticleModel = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(1, { message: "must not be empty" }),
  content: z.string().trim().min(1, { message: "must not be empty" }),
  imgUrl: z.string().nullish(),
  categoryId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteNews_Article extends z.infer<typeof News_ArticleModel> {
  Category: CompleteNews_Category
  User: CompleteUser
}

/**
 * RelatedNews_ArticleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNews_ArticleModel: z.ZodSchema<CompleteNews_Article> = z.lazy(() => News_ArticleModel.extend({
  Category: RelatedNews_CategoryModel,
  User: RelatedUserModel,
}))
