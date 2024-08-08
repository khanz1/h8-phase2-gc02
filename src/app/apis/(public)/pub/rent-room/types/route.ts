import prisma from "@/dbs/prisma";
import { errorCreator } from "@/utils/error-creator";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.room_Type.findMany();

    return NextResponse.json({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
