import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { News_CategoryModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const category = await findEntityById(params.id, prisma.news_Category);

    return NextResponse.json<ApiResponseData<News_Category>>({
      statusCode: 200,
      data: category,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const category = await findEntityById(params.id, prisma.news_Category);
    const data = await validateRequestBody(req, News_CategoryModel);

    await prisma.news_Category.update({
      where: {
        id: category.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Category id: ${category.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const category = await findEntityById(params.id, prisma.news_Category);

    await prisma.news_Category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Category id: ${category.id} deleted successfully`,
    });
  },
);
