import prisma from "@/dbs/prisma";
import { Lecture_MovieModel } from "@/defs/zod";
import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
import { getQueryOptions, getRequestBody } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Lecture_Movie } from "@prisma/client";
import { NextResponse } from "next/server";
// import prisma from "@/dbs/prisma";
// import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
// import { getQueryOptions } from "@/utils/data-parser";
// import {
//   getPaginatedResponse,
//   PaginatedApiResponse,
// } from "@/utils/paginated-response";
// import { withErrorHandler } from "@/utils/with-error-handler";
// import { Movie_Movie } from "@prisma/client";
// import { NextResponse } from "next/server";
//
// export const GET = withErrorHandler(async (_, params) => {
//   const searchParams = await validatePublicSearchParams(params.searchParams);
//   const options = getQueryOptions(searchParams, "title", "createdAt", "Genre");
//
//   const [movies, rows] = await prisma.$transaction([
//     prisma.movie_Movie.findMany(options),
//     prisma.movie_Movie.count({
//       where: options.where,
//     }),
//   ]);
//
//   return NextResponse.json<PaginatedApiResponse<Movie_Movie[]>>({
//     statusCode: 200,
//     data: getPaginatedResponse(movies, searchParams, rows),
//   });
// });

export const GET = withErrorHandler(async (_, params) => {
  const searchParams = await validatePublicSearchParams(params.searchParams);
  const options = getQueryOptions(searchParams, "title", "createdAt", "Genre");

  const [movies, rows] = await prisma.$transaction([
    prisma.lecture_Movie.findMany(options),
    prisma.lecture_Movie.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Lecture_Movie[]>>({
    statusCode: 200,
    data: getPaginatedResponse(movies, searchParams, rows),
  });
});

export const POST = withErrorHandler(async (req) => {
  const body = await getRequestBody(req);

  const data = await Lecture_MovieModel.parseAsync(body);
  const movie = await prisma.lecture_Movie.create({
    data,
  });

  return NextResponse.json(movie);
});
