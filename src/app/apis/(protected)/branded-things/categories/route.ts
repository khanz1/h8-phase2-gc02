import prisma from "@/dbs/prisma";
import { Branded_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler<Branded_Category[]>(async () => {
  const categories = await prisma.branded_Category.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: categories,
  });
});

export const POST = withErrorHandler<Branded_Category>(
  async (req: NextRequest) => {
    const requestBody = await getRequestBody(req);
    const data = await Branded_CategoryModel.parseAsync(requestBody);

    const category = await prisma.branded_Category.create({
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
