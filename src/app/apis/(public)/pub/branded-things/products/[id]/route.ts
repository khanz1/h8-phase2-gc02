import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicDetailParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicDetailParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const product = await prisma.branded_Product.findUnique({
      where: {
        id,
      },
      include: {
        Category: {
          select: prismaExclude("Branded_Category", ["id"]),
        },
        User: {
          select: prismaExclude("User", ["id", "password", "role"]),
        },
      },
    });

    if (!product) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: product,
    });
  },
);
