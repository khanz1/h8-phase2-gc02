import { extractUserFromHeader } from "@/utils/data-parser";
import { ErrorMessage, ForbiddenError } from "@/utils/http-error";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextRequest } from "next/server";

export const guardAdminAndAuthor = async (
  cuisine: Restaurant_Cuisine,
  req: NextRequest,
) => {
  const user = extractUserFromHeader(req);

  if (user.role !== "Admin" && user.id !== cuisine.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
