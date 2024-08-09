import prisma from "@/dbs/prisma";
import { extractUserFromHeader } from "@/utils/data-parser";
import {
  ErrorMessage,
  ForbiddenError,
  NotFoundError,
} from "@/utils/http-error";
import { NextRequest } from "next/server";

export const guardAdminAndAuthor = async (id: number, req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const movie = await prisma.movie_Movie.findFirst({
    where: {
      id,
    },
  });

  if (!movie) {
    throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== movie.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
