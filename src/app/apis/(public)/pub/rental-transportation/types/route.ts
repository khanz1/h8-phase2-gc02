import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
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
