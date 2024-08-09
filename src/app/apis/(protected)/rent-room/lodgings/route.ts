import prisma, { prismaExclude } from "@/dbs/prisma";
import { Room_LodgingModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
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
  const requestBody = await getRequestBody(req);
  requestBody.typeId = parseInt(requestBody.typeId);
  requestBody.authorId = user.id;

  const data = await Room_LodgingModel.parseAsync(requestBody);

  const lodging = await prisma.room_Lodging.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: lodging,
    },
    {
      status: 201,
    },
  );
});
