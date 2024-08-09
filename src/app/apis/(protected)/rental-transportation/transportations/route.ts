import prisma, { prismaExclude } from "@/dbs/prisma";
import { Rental_TransportationModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const transportations = await prisma.rental_Transportation.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: transportations,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);

  const requestBody = await getRequestBody(req);
  requestBody.typeId = parseInt(requestBody.typeId);
  requestBody.authorId = user.id;

  const data = await Rental_TransportationModel.parseAsync(requestBody);

  const transportation = await prisma.rental_Transportation.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: transportation,
    },
    {
      status: 201,
    },
  );
});
