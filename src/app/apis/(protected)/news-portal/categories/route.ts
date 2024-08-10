import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { News_CategoryModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const categories = await prisma.news_Category.findMany();

  return NextResponse.json<ApiResponseData<News_Category[]>>({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await validateRequestBody(req, News_CategoryModel);

  const category = await prisma.news_Category.create({
    data,
  });

  return NextResponse.json<ApiResponseData<News_Category>>(
    {
      statusCode: 201,
      data: category,
    },
    {
      status: 201,
    },
  );
});
