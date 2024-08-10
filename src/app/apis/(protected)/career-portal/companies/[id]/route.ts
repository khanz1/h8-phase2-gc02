import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Career_CompanyModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Company } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const company = await findEntityById(params.id, prisma.career_Company);

    return NextResponse.json<ApiResponseData<Career_Company>>({
      statusCode: 200,
      data: company,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const data = await validateRequestBody(req, Career_CompanyModel);
    const company = await findEntityById(params.id, prisma.career_Company);

    await prisma.career_Company.update({
      where: {
        id: company.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Company id: ${company.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const company = await findEntityById(params.id, prisma.career_Company);

    await prisma.career_Company.delete({
      where: {
        id: company.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Company id: ${company.id} deleted successfully`,
    });
  },
);
