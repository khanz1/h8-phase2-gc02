import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { News_CategoryModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const query = await prisma.news_Category.findMany();

  return NextResponse.json<CustomResponse<News_Category[]>>({
    statusCode: 200,
    data: query,
  });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const headersUserData = req.headers.get("x-custom-data-user");

  if (!headersUserData) {
    throw new Error("INVALID_TOKEN");
  }

  const requestData = await parsingData(req);
  const parsedData = News_CategoryModel.safeParse(requestData);

  if (!parsedData.success) {
    throw parsedData.error;
  }

  const query = await prisma.news_Category.create({
    data: parsedData.data,
  });

  return NextResponse.json<CustomResponse<News_Category>>(
    {
      statusCode: 201,
      data: query,
    },
    {
      status: 201,
    },
  );
});
