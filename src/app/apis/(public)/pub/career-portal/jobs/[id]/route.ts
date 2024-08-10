import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicParams>(async (_req, { params }) => {
  const id = parseInt(params.id);

  const query = await prisma.career_Job.findUnique({
    where: {
      id,
    },
    include: {
      Company: {
        select: prismaExclude("Career_Company", ["id"]),
      },
      User: {
        select: prismaExclude("User", ["id", "password", "role"]),
      },
    },
  });

  if (!query) {
    throw new NotFoundError(ErrorMessage.JOB_NOT_FOUND);
  }

  return NextResponse.json({
    statusCode: 200,
    data: query,
  });
});
