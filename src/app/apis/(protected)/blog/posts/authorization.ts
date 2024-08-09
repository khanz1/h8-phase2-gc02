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

  const post = await prisma.blog_Post.findFirst({
    where: {
      id,
    },
  });

  if (!post) {
    throw new NotFoundError(ErrorMessage.POST_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== post.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
