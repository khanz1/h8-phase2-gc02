import prisma, { prismaExclude } from "@/dbs/prisma";
import { Movie_MovieModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
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
  const requestBody = await getRequestBody(req);
  requestBody.genreId = parseInt(requestBody.genreId);
  requestBody.authorId = user.id;

  const data = await Movie_MovieModel.parseAsync(requestBody);

  const movie = await prisma.movie_Movie.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: movie,
    },
    {
      status: 201,
    },
  );
});
