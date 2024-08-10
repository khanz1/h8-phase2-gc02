import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Movie_GenreModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Genre } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const genres = await prisma.movie_Genre.findMany();

  return NextResponse.json<ApiResponseData<Movie_Genre[]>>({
    statusCode: 200,
    data: genres,
  });
});

export const POST = withErrorHandler(async (req) => {
  const data = await validateRequestBody(req, Movie_GenreModel);

  const genre = await prisma.movie_Genre.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Movie_Genre>>(
    {
      statusCode: 201,
      data: genre,
    },
    {
      status: 201,
    },
  );
});
