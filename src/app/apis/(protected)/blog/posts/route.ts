import prisma, { prismaExclude } from "@/dbs/prisma";
import { Blog_PostModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const posts = await prisma.blog_Post.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: posts,
  });
});

export const POST = withErrorHandler<Blog_Post>(async (req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const requestBody = await getRequestBody(req);
  requestBody.categoryId = parseInt(requestBody.categoryId);
  requestBody.authorId = user.id;

  const data = await Blog_PostModel.parseAsync(requestBody);

  const post = await prisma.blog_Post.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: post,
    },
    {
      status: 201,
    },
  );
});
