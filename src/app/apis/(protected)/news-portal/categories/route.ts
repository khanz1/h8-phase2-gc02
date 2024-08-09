import prisma from "@/dbs/prisma";
import { News_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler<News_Category[]>(async () => {
  const categories = await prisma.news_Category.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler<News_Category>(
  async (req: NextRequest) => {
    const requestBody = await getRequestBody(req);
    const data = await News_CategoryModel.parseAsync(requestBody);

    const category = await prisma.news_Category.create({
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
