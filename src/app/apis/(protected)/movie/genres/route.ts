import prisma from "@/dbs/prisma";
import { Movie_GenreModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Genre } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Movie_Genre[]>(async () => {
  const genres = await prisma.movie_Genre.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: genres,
  });
});

export const POST = withErrorHandler<Movie_Genre>(async (req) => {
  const requestBody = await getRequestBody(req);
  const data = await Movie_GenreModel.parseAsync(requestBody);

  const genre = await prisma.movie_Genre.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: genre,
    },
    {
      status: 201,
    },
  );
});
