import prisma from "@/dbs/prisma";
import { Blog_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler<Blog_Category[]>(async () => {
  const categories = await prisma.blog_Category.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler<Blog_Category>(
  async (req: NextRequest) => {
    const requestBody = await getRequestBody(req);
    const data = await Blog_CategoryModel.parseAsync(requestBody);

    const category = await prisma.blog_Category.create({
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
  },
);
