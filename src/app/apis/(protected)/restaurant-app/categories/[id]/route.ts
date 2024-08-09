import prisma from "@/dbs/prisma";
import { CustomResponse, ProtectedHandlerParams } from "@/defs/custom-response";
import { Restaurant_CategoryModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Category } from "@prisma/client";
import { NextResponse } from "next/server";

const findCategoryById = async (id: string) => {
  const category = await prisma.restaurant_Category.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!category) {
    throw new NotFoundError(ErrorMessage.CATEGORY_NOT_FOUND);
  }

  return category;
};

export const GET = withErrorHandler<
  Restaurant_Category,
  ProtectedHandlerParams
>(async (_req, { params }) => {
  const category = await findCategoryById(params.id);

  return NextResponse.json<CustomResponse<Restaurant_Category>>({
    statusCode: 200,
    data: category,
  });
});

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const requestBody = await getRequestBody(req);
    const data = await Restaurant_CategoryModel.parseAsync(requestBody);
    const category = await findCategoryById(params.id);

    await prisma.restaurant_Category.update({
      where: {
        id: category.id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Category id: ${category.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const category = await findCategoryById(params.id);

    await prisma.restaurant_Category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Category id: ${category.id} deleted successfully`,
    });
  },
);
