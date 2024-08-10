import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const types = await prisma.room_Type.findMany();

  return NextResponse.json<ApiResponseData<Room_Type[]>>({
    statusCode: 200,
    data: types,
  });
});
