import prisma from "@/dbs/prisma";
import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
import { getQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Movie } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (_, params) => {
  const searchParams = await validatePublicSearchParams(params.searchParams);
  const options = getQueryOptions(searchParams, "title", "createdAt", "Genre");

  const [movies, rows] = await prisma.$transaction([
    prisma.movie_Movie.findMany(options),
    prisma.movie_Movie.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Movie_Movie[]>>({
    statusCode: 200,
    data: getPaginatedResponse(movies, searchParams, rows),
  });
});
