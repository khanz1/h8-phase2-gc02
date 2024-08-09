import prisma from "@/dbs/prisma";
import { CustomResponse, ProtectedHandlerParams } from "@/defs/custom-response";
import { Career_CompanyModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Company } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Career_Company, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const company = await prisma.career_Company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND);
    }

    return NextResponse.json<CustomResponse<Career_Company>>({
      statusCode: 200,
      data: company,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const requestBody = await getRequestBody(req);
    const data = await Career_CompanyModel.parseAsync(requestBody);

    const company = await prisma.career_Company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND);
    }

    await prisma.career_Company.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Company id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const company = await prisma.career_Company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND);
    }

    await prisma.career_Company.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Company id: ${id} deleted successfully`,
    });
  },
);
