import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Blog_PostModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Post } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

export const GET = withErrorHandler<Blog_Post, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const post = await prisma.blog_Post.findUnique({
      where: {
        id,
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

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const user = await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    requestBody.categoryId = parseInt(requestBody.categoryId);
    requestBody.authorId = user.id;

    const data = await Blog_PostModel.parseAsync(requestBody);

    await prisma.blog_Post.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Post id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    await prisma.blog_Post.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Post id: ${id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    const data = await PatchBodyFormData.parseAsync(requestBody);

    const responseImagekit = await uploadImage(data.file);

    await prisma.blog_Post.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Post id: ${id} image updated successfully`,
    });
  },
);
