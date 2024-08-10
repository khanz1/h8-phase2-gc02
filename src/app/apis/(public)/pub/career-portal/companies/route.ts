import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Company } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const companies = await prisma.career_Company.findMany();

  return NextResponse.json<ApiResponseData<Career_Company[]>>({
    statusCode: 200,
    data: companies,
  });
});
