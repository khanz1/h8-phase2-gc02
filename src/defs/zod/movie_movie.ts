import * as z from "zod"
import { CompleteMovie_Genre, RelatedMovie_GenreModel, CompleteUser, RelatedUserModel } from "./index"

export const Movie_MovieModel = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(1, { message: "must not be empty" }),
  synopsis: z.string().trim().min(1, { message: "must not be empty" }),
  trailerUrl: z.string().nullish(),
  imgUrl: z.string().nullish(),
  rating: z.number().int().min(1),
  genreId: z.number().int(),
  authorId: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteMovie_Movie extends z.infer<typeof Movie_MovieModel> {
  Genre: CompleteMovie_Genre
  User: CompleteUser
}

/**
 * RelatedMovie_MovieModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMovie_MovieModel: z.ZodSchema<CompleteMovie_Movie> = z.lazy(() => Movie_MovieModel.extend({
  Genre: RelatedMovie_GenreModel,
  User: RelatedUserModel,
}))
