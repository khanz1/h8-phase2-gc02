import prisma from "@/dbs/prisma";
import { Career_CompanyModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Company } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler<Career_Company[]>(async () => {
  const companies = await prisma.career_Company.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: companies,
  });
});

export const POST = withErrorHandler<Career_Company>(
  async (req: NextRequest) => {
    const requestBody = await getRequestBody(req);
    const data = await Career_CompanyModel.parseAsync(requestBody);

    const company = await prisma.career_Company.create({
      data,
    });

    return NextResponse.json(
      {
        statusCode: 201,
        data: company,
      },
      {
        status: 201,
      },
    );
  },
);
