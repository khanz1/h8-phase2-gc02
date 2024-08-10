import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Career_CompanyModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
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

export const POST = withErrorHandler(async (req) => {
  const data = await validateRequestBody(req, Career_CompanyModel);

  const company = await prisma.career_Company.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Career_Company>>(
    {
      statusCode: 201,
      data: company,
    },
    {
      status: 201,
    },
  );
});
