import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Blog_CategoryModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const categories = await prisma.blog_Category.findMany();

  return NextResponse.json<ApiResponseData<Blog_Category[]>>({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler(async (req) => {
  const data = await validateRequestBody(req, Blog_CategoryModel);

  const category = await prisma.blog_Category.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Blog_Category>>(
    {
      statusCode: 201,
      data: category,
    },
    {
      status: 201,
    },
  );
});
