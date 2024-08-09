import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Room_TypeModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Room_Type, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const type = await prisma.room_Type.findUnique({
      where: {
        id,
      },
    });

    if (!type) {
      throw new NotFoundError(ErrorMessage.TYPE_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: type,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const requestBody = await getRequestBody(req);
    const data = await Room_TypeModel.parseAsync(requestBody);

    const type = await prisma.room_Type.findUnique({
      where: {
        id,
      },
    });

    if (!type) {
      throw new NotFoundError(ErrorMessage.TYPE_NOT_FOUND);
    }

    await prisma.room_Type.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Type id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const type = await prisma.room_Type.findUnique({
      where: {
        id,
      },
    });

    if (!type) {
      throw new NotFoundError(ErrorMessage.TYPE_NOT_FOUND);
    }

    await prisma.room_Type.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Type id: ${id} deleted successfully`,
    });
  },
);
