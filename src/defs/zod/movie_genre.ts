import * as z from "zod"
import { CompleteMovie_Movie, RelatedMovie_MovieModel } from "./index"

export const Movie_GenreModel = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, { message: "must not be empty" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface CompleteMovie_Genre extends z.infer<typeof Movie_GenreModel> {
  Movies: CompleteMovie_Movie[]
}

/**
 * RelatedMovie_GenreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMovie_GenreModel: z.ZodSchema<CompleteMovie_Genre> = z.lazy(() => Movie_GenreModel.extend({
  Movies: RelatedMovie_MovieModel.array(),
}))
