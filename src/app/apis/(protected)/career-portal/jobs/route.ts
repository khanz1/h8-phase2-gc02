import prisma, { prismaExclude } from "@/dbs/prisma";
import { Career_JobModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

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

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const requestBody = await getRequestBody(req);
  requestBody.companyId = parseInt(requestBody.companyId);
  requestBody.authorId = user.id;

  const data = await Career_JobModel.parseAsync(requestBody);

  const job = await prisma.career_Job.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: job,
    },
    {
      status: 201,
    },
  );
});
