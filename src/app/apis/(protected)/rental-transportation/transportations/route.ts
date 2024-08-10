import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Rental_TransportationModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Transportation } from "@prisma/client";
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
  const data = await validateRequestBody(req, Rental_TransportationModel, {
    authorId: user.id,
  });

  const transportation = await prisma.rental_Transportation.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Rental_Transportation>>(
    {
      statusCode: 201,
      data: transportation,
    },
    {
      status: 201,
    },
  );
});
