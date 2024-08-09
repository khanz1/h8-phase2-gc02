import prisma, { prismaExclude } from "@/dbs/prisma";
import { Branded_ProductModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const products = await prisma.branded_Product.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: products,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);

  const requestBody = await getRequestBody(req);
  requestBody.categoryId = parseInt(requestBody.categoryId);
  requestBody.authorId = user.id;

  const data = await Branded_ProductModel.parseAsync(requestBody);

  const product = await prisma.branded_Product.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: product,
    },
    {
      status: 201,
    },
  );
});
