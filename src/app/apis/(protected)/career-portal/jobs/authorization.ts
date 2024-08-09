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

  const job = await prisma.career_Job.findFirst({
    where: {
      id,
    },
  });

  if (!job) {
    throw new NotFoundError(ErrorMessage.JOB_NOT_FOUND);
  }

  if (user.role !== "Admin" && user.id !== job.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
