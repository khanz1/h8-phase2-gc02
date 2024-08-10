import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicDetailParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicDetailParams>(
  async (_, { params }) => {
    const id = parseInt(params.id);

    const post = await prisma.blog_Post.findUnique({
      where: {
        id,
      },
      include: {
        Category: {
          select: prismaExclude("Blog_Category", ["id"]),
        },
        User: {
          select: prismaExclude("User", ["id", "password", "role"]),
        },
      },
    });

    if (!post) {
      throw new NotFoundError(ErrorMessage.POST_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: post,
    });
  },
);
