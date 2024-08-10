import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { News_ArticleModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { News_Article } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const article = await findEntityById(params.id, prisma.news_Article);

    return NextResponse.json<ApiResponseData<News_Article>>({
      statusCode: 200,
      data: article,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const article = await findEntityById(params.id, prisma.news_Article);

    const user = await guardAdminAndAuthor(req, article);
    const data = await validateRequestBody(req, News_ArticleModel, {
      authorId: user.id,
    });

    await prisma.news_Article.update({
      where: {
        id: article.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Article id: ${article.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const article = await findEntityById(params.id, prisma.news_Article);
    await guardAdminAndAuthor(req, article);

    await prisma.news_Article.delete({
      where: {
        id: article.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Article id: ${article.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const article = await findEntityById(params.id, prisma.news_Article);
    await guardAdminAndAuthor(req, article);

    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(data.file, "news-portal");

    await prisma.news_Article.update({
      where: {
        id: article.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Article id: ${article.id} image updated successfully`,
    });
  },
);
