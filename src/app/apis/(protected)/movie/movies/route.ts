import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Movie_MovieModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Movie } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const movies = await prisma.movie_Movie.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: movies,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Movie_MovieModel, {
    authorId: user.id,
  });

  const movie = await prisma.movie_Movie.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Movie_Movie>>(
    {
      statusCode: 201,
      data: movie,
    },
    {
      status: 201,
    },
  );
});
