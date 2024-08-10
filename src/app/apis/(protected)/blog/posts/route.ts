import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Blog_PostModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Post } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const posts = await prisma.blog_Post.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json<ApiResponseData<Blog_Post[]>>({
    statusCode: 200,
    data: posts,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Blog_PostModel, {
    authorId: user.id,
  });

  const post = await prisma.blog_Post.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Blog_Post>>(
    {
      statusCode: 201,
      data: post,
    },
    {
      status: 201,
    },
  );
});
