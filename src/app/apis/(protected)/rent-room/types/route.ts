import prisma from "@/dbs/prisma";
import { Room_TypeModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Room_Type[]>(async () => {
  const types = await prisma.room_Type.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: types,
  });
});

export const POST = withErrorHandler<Room_Type>(async (req) => {
  const requestBody = await getRequestBody(req);
  const data = await Room_TypeModel.parseAsync(requestBody);

  const type = await prisma.room_Type.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: type,
    },
    {
      status: 201,
    },
  );
});
