import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
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
