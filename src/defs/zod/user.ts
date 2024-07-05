import * as z from "zod"
import { CompleteBlog_Post, RelatedBlog_PostModel, CompleteBranded_Product, RelatedBranded_ProductModel, CompleteMovie_Movie, RelatedMovie_MovieModel, CompleteRental_Transportation, RelatedRental_TransportationModel, CompleteRoom_Lodging, RelatedRoom_LodgingModel, CompleteNews_Article, RelatedNews_ArticleModel, CompleteCareer_Job, RelatedCareer_JobModel, CompleteRestaurant_Cuisine, RelatedRestaurant_CuisineModel } from "./index"

export const UserModel = z.object({
  id: z.number().int().optional(),
  username: z.string().nullish(),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.string().optional(),
  phoneNumber: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  Blog_Post: CompleteBlog_Post[]
  Branded_Product: CompleteBranded_Product[]
  Movie_Movie: CompleteMovie_Movie[]
  Rental_Transportation: CompleteRental_Transportation[]
  Room_Lodging: CompleteRoom_Lodging[]
  News_Article: CompleteNews_Article[]
  Career_Job: CompleteCareer_Job[]
  Restaurant_Cuisine: CompleteRestaurant_Cuisine[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  Blog_Post: RelatedBlog_PostModel.array(),
  Branded_Product: RelatedBranded_ProductModel.array(),
  Movie_Movie: RelatedMovie_MovieModel.array(),
  Rental_Transportation: RelatedRental_TransportationModel.array(),
  Room_Lodging: RelatedRoom_LodgingModel.array(),
  News_Article: RelatedNews_ArticleModel.array(),
  Career_Job: RelatedCareer_JobModel.array(),
  Restaurant_Cuisine: RelatedRestaurant_CuisineModel.array(),
}))
