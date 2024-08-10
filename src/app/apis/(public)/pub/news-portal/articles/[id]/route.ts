import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicParams>(async (_req, { params }) => {
  const id = parseInt(params.id);

  const query = await prisma.news_Article.findUnique({
    where: {
      id,
    },
    include: {
      Category: {
        select: prismaExclude("News_Category", ["id"]),
      },
      User: {
        select: prismaExclude("User", ["id", "password", "role"]),
      },
    },
  });

  if (!query) {
    throw new NotFoundError(ErrorMessage.ARTICLE_NOT_FOUND);
  }

  return NextResponse.json({
    statusCode: 200,
    data: query,
  });
});
