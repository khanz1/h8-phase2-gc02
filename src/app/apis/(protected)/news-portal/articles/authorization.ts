import prisma from "@/dbs/prisma";
import { extractUserFromHeader } from "@/utils/data-parser";
import {
  ErrorMessage,
  ForbiddenError,
  NotFoundError,
} from "@/utils/http-error";
import { NextRequest } from "next/server";

export const guardAdminAndAuthor = async (id: number, req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const article = await prisma.news_Article.findFirst({
    where: {
      id,
    },
  });

  if (!article) {
    throw new NotFoundError(ErrorMessage.ARTICLE_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== article.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
