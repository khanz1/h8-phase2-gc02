import prisma from "@/dbs/prisma";
import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";
import { getPaginatedResponse } from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { parsedSearchParams, options } =
    createParsedSearchParamsAndOptionQuery(req, "title", "createdAt", "Genre");

  const [query, rows] = await prisma.$transaction([
    prisma.movie_Movie.findMany(options),
    prisma.movie_Movie.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json({
    statusCode: 200,
    data: getPaginatedResponse(query, parsedSearchParams, rows),
  });
});
