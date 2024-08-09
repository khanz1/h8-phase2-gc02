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

  const product = await prisma.branded_Product.findFirst({
    where: {
      id,
    },
  });

  if (!product) {
    throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== product.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
