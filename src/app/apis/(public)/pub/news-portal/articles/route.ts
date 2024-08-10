import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Article } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "title",
    "createdAt",
    "Category",
  );

  const [articles, rows] = await prisma.$transaction([
    prisma.news_Article.findMany(options),
    prisma.news_Article.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<News_Article[]>>({
    statusCode: 200,
    data: getPaginatedResponse(articles, searchParams, rows),
  });
});
