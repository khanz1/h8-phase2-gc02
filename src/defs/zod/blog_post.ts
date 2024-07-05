import * as z from "zod"
import { CompleteBlog_Category, RelatedBlog_CategoryModel, CompleteUser, RelatedUserModel } from "./index"

export const Blog_PostModel = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(1, { message: "must not be empty" }),
  content: z.string().trim().min(1, { message: "must not be empty" }),
  imgUrl: z.string().optional().nullish(),
  categoryId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteBlog_Post extends z.infer<typeof Blog_PostModel> {
  Category: CompleteBlog_Category
  User: CompleteUser
}

/**
 * RelatedBlog_PostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBlog_PostModel: z.ZodSchema<CompleteBlog_Post> = z.lazy(() => Blog_PostModel.extend({
  Category: RelatedBlog_CategoryModel,
  User: RelatedUserModel,
}))
