import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { Room_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.room_Type.findMany();

    return NextResponse.json<CustomResponse<Room_Type[]>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
