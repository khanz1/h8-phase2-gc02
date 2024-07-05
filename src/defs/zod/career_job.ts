import * as z from "zod"
import { CompleteCareer_Company, RelatedCareer_CompanyModel, CompleteUser, RelatedUserModel } from "./index"

export const Career_JobModel = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(1, { message: "must not be empty" }),
  description: z.string().trim().min(1, { message: "must not be empty" }),
  imgUrl: z.string(),
  jobType: z.string(),
  companyId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteCareer_Job extends z.infer<typeof Career_JobModel> {
  Company: CompleteCareer_Company
  User: CompleteUser
}

/**
 * RelatedCareer_JobModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCareer_JobModel: z.ZodSchema<CompleteCareer_Job> = z.lazy(() => Career_JobModel.extend({
  Company: RelatedCareer_CompanyModel,
  User: RelatedUserModel,
}))
