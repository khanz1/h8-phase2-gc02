import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Post } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "title",
    "createdAt",
    "Category",
  );

  const [posts, rows] = await prisma.$transaction([
    prisma.blog_Post.findMany(options),
    prisma.blog_Post.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Blog_Post[]>>({
    statusCode: 200,
    data: getPaginatedResponse(posts, searchParams, rows),
  });
});
