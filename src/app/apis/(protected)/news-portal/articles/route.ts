import prisma, { prismaExclude } from "@/dbs/prisma";
import { News_ArticleModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
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

  const requestBody = await getRequestBody(req);
  requestBody.categoryId = parseInt(requestBody.categoryId);
  requestBody.authorId = user.id;

  const data = await News_ArticleModel.parseAsync(requestBody);

  const article = await prisma.news_Article.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: article,
    },
    {
      status: 201,
    },
  );
});
