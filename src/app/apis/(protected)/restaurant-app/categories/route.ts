import prisma from "@/dbs/prisma";
import { Restaurant_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Restaurant_Category[]>(async () => {
  const categories = await prisma.restaurant_Category.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler<Restaurant_Category>(async (req) => {
  const requestBody = await getRequestBody(req);
  const data = await Restaurant_CategoryModel.parseAsync(requestBody);

  const category = await prisma.restaurant_Category.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: category,
    },
    {
      status: 201,
    },
  );
});
