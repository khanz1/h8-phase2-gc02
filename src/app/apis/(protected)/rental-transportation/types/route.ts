import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Rental_TypeModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const types = await prisma.rental_Type.findMany();

  return NextResponse.json<ApiResponseData<Rental_Type[]>>({
    statusCode: 200,
    data: types,
  });
});

export const POST = withErrorHandler(async (req) => {
  const data = await validateRequestBody(req, Rental_TypeModel);
  const type = await prisma.rental_Type.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Rental_Type>>(
    {
      statusCode: 201,
      data: type,
    },
    {
      status: 201,
    },
  );
});
