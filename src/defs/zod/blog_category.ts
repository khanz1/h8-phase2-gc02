import * as z from "zod"
import { CompleteBlog_Post, RelatedBlog_PostModel } from "./index"

export const Blog_CategoryModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteBlog_Category extends z.infer<typeof Blog_CategoryModel> {
  Posts: CompleteBlog_Post[]
}

/**
 * RelatedBlog_CategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBlog_CategoryModel: z.ZodSchema<CompleteBlog_Category> = z.lazy(() => Blog_CategoryModel.extend({
  Posts: RelatedBlog_PostModel.array(),
}))
