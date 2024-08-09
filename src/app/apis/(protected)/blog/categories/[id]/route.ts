import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Blog_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Blog_Category, ProtectedHandlerParams>(
  async (_, { params }) => {
    const id = parseInt(params.id);

    const category = await prisma.blog_Category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundError(ErrorMessage.CATEGORY_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: category,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const requestBody = await getRequestBody(req);
    const data = await Blog_CategoryModel.parseAsync(requestBody);

    const category = await prisma.blog_Category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundError(ErrorMessage.CATEGORY_NOT_FOUND);
    }

    await prisma.blog_Category.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Category id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const category = await prisma.blog_Category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundError(ErrorMessage.CATEGORY_NOT_FOUND);
    }

    await prisma.blog_Category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Category id: ${id} deleted successfully`,
    });
  },
);
