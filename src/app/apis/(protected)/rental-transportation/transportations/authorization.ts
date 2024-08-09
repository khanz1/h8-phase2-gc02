import { extractUserFromHeader } from "@/utils/data-parser";
import { ErrorMessage, ForbiddenError } from "@/utils/http-error";
import { Rental_Transportation } from "@prisma/client";
import { NextRequest } from "next/server";

export const guardAdminAndAuthor = async (
  transportation: Rental_Transportation,
  req: NextRequest,
) => {
  const user = extractUserFromHeader(req);

  if (user.role !== "Admin" && user.id !== transportation.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
