import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { News_ArticleModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Article } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const articles = await prisma.news_Article.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: articles,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, News_ArticleModel, {
    authorId: user.id,
  });

  const article = await prisma.news_Article.create({
    data,
  });

  return NextResponse.json<ApiResponseData<News_Article>>(
    {
      statusCode: 201,
      data: article,
    },
    {
      status: 201,
    },
  );
});
