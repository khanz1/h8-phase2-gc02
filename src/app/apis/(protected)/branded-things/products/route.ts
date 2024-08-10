import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Branded_ProductModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Product } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const products = await prisma.branded_Product.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json<ApiResponseData<Branded_Product[]>>({
    statusCode: 200,
    data: products,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Branded_ProductModel, {
    authorId: user.id,
  });

  const product = await prisma.branded_Product.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Branded_Product>>(
    {
      statusCode: 201,
      data: product,
    },
    {
      status: 201,
    },
  );
});
