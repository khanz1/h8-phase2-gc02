import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Blog_PostModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Blog_Post } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const post = await findEntityById(params.id, prisma.blog_Post);

    return NextResponse.json<ApiResponseData<Blog_Post>>({
      statusCode: 200,
      data: post,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const post = await findEntityById(params.id, prisma.blog_Post);
    const user = await guardAdminAndAuthor(req, post);
    const data = await validateRequestBody(req, Blog_PostModel, {
      authorId: user.id,
    });

    await prisma.blog_Post.update({
      where: {
        id: post.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Post id: ${post.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const post = await findEntityById(params.id, prisma.blog_Post);
    await guardAdminAndAuthor(req, post);

    await prisma.blog_Post.delete({
      where: {
        id: post.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Post id: ${post.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const data = await validateRequestBody(req, PatchBodyFormData);
    const post = await findEntityById(params.id, prisma.blog_Post);

    await guardAdminAndAuthor(req, post);

    const responseImagekit = await uploadImage(data.file, "blog");

    await prisma.blog_Post.update({
      where: {
        id: post.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Post id: ${post.id} image updated successfully`,
    });
  },
);
