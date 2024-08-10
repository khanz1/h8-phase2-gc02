import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Rental_TypeModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const type = await findEntityById(params.id, prisma.rental_Type);

    return NextResponse.json<ApiResponseData<Rental_Type>>({
      statusCode: 200,
      data: type,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const data = await validateRequestBody(req, Rental_TypeModel);
    const type = await findEntityById(params.id, prisma.rental_Type);

    await prisma.rental_Type.update({
      where: {
        id: type.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Type id: ${type.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const type = await findEntityById(params.id, prisma.rental_Type);

    await prisma.rental_Type.delete({
      where: {
        id: type.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Type id: ${type.id} deleted successfully`,
    });
  },
);
