import * as z from "zod";

export const Lecture_MovieModel = z.object({
  id: z.number().int().optional(),
  title: z.string().trim().min(1, { message: "must not be empty" }),
  synopsis: z.string().optional(),
  coverUrl: z.string().url(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
