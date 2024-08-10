import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Career_JobModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Job } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const jobs = await prisma.career_Job.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: jobs,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Career_JobModel, {
    authorId: user.id,
  });

  const job = await prisma.career_Job.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Career_Job>>(
    {
      statusCode: 201,
      data: job,
    },
    {
      status: 201,
    },
  );
});
