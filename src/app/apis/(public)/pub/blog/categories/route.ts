import prisma from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
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
