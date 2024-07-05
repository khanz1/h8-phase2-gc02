import * as z from "zod"
import { CompleteCareer_Job, RelatedCareer_JobModel } from "./index"

export const Career_CompanyModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  companyLogo: z.string(),
  location: z.string(),
  email: z.string(),
  description: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteCareer_Company extends z.infer<typeof Career_CompanyModel> {
  Jobs: CompleteCareer_Job[]
}

/**
 * RelatedCareer_CompanyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCareer_CompanyModel: z.ZodSchema<CompleteCareer_Company> = z.lazy(() => Career_CompanyModel.extend({
  Jobs: RelatedCareer_JobModel.array(),
}))
