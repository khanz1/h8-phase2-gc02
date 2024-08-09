import prisma from "@/dbs/prisma";
import { Rental_TypeModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Type } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Rental_Type[]>(async () => {
  const types = await prisma.rental_Type.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: types,
  });
});

export const POST = withErrorHandler<Rental_Type>(async (req) => {
  const requestBody = await getRequestBody(req);
  const data = await Rental_TypeModel.parseAsync(requestBody);

  const type = await prisma.rental_Type.create({
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
