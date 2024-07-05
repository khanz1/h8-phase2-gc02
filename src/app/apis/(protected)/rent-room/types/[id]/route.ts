import prisma from "@/dbs/prisma";
import { CustomResponse, GlobalProtectedParams } from "@/defs/custom-response";
import { Room_TypeModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { Room_Type } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.room_Type.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("TYPE_NOT_FOUND");
    }

    return NextResponse.json<CustomResponse<Room_Type>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const requestData = await parsingData(req);
    const parsedData = Room_TypeModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const query = await prisma.room_Type.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("TYPE_NOT_FOUND");
    }

    await prisma.room_Type.update({
      where: {
        id: parseInt(id),
      },
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Type id: ${id} updated successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.room_Type.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("TYPE_NOT_FOUND");
    }

    await prisma.room_Type.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Type id: ${id} deleted successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
