import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicDetailParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicDetailParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const query = await prisma.rental_Transportation.findUnique({
      where: {
        id,
      },
      include: {
        Type: {
          select: prismaExclude("Rental_Type", ["id"]),
        },
        User: {
          select: prismaExclude("User", ["id", "password", "role"]),
        },
      },
    });

    if (!query) {
      throw new NotFoundError(ErrorMessage.TRANSPORTATION_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: query,
    });
  },
);
