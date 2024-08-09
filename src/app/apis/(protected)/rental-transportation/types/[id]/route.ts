import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Rental_TypeModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Type } from "@prisma/client";
import { NextResponse } from "next/server";

const findTypeById = async (id: string) => {
  const type = await prisma.rental_Type.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!type) {
    throw new NotFoundError(ErrorMessage.TYPE_NOT_FOUND);
  }

  return type;
};

export const GET = withErrorHandler<Rental_Type, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const type = await findTypeById(params.id);

    return NextResponse.json({
      statusCode: 200,
      data: type,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const requestBody = await getRequestBody(req);
    const data = await Rental_TypeModel.parseAsync(requestBody);
    const type = await findTypeById(params.id);

    await prisma.rental_Type.update({
      where: {
        id: type.id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Type id: ${type.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const type = await findTypeById(params.id);

    await prisma.rental_Type.delete({
      where: {
        id: type.id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Type id: ${type.id} deleted successfully`,
    });
  },
);
