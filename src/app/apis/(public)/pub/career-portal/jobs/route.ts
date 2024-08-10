import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Job } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "title",
    "createdAt",
    "Company",
  );

  const [jobs, rows] = await prisma.$transaction([
    prisma.career_Job.findMany(options),
    prisma.career_Job.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Career_Job[]>>({
    statusCode: 200,
    data: getPaginatedResponse(jobs, searchParams, rows),
  });
});
