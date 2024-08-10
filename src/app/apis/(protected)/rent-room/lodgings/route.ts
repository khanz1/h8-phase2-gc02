import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Room_LodgingModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Lodging } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const lodgings = await prisma.room_Lodging.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: lodgings,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Room_LodgingModel, {
    authorId: user.id,
  });

  const lodging = await prisma.room_Lodging.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Room_Lodging>>(
    {
      statusCode: 201,
      data: lodging,
    },
    {
      status: 201,
    },
  );
});
