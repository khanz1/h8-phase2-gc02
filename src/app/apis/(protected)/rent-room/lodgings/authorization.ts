import prisma from "@/dbs/prisma";
import { extractUserFromHeader } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { NextRequest } from "next/server";

export const guardAdminAndAuthor = async (id: number, req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const lodging = await prisma.room_Lodging.findFirst({
    where: {
      id,
    },
  });

  if (!lodging) {
    throw new NotFoundError(ErrorMessage.LODGING_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== lodging.authorId) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
