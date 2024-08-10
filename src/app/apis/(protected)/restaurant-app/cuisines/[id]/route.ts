import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Restaurant_CuisineModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const cuisine = await findEntityById(params.id, prisma.restaurant_Cuisine);

    return NextResponse.json<ApiResponseData<Restaurant_Cuisine>>({
      statusCode: 200,
      data: cuisine,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const cuisine = await findEntityById(params.id, prisma.restaurant_Cuisine);
    const user = await guardAdminAndAuthor(req, cuisine);

    const data = await validateRequestBody(req, Restaurant_CuisineModel, {
      authorId: user.id,
    });

    await prisma.restaurant_Cuisine.update({
      where: {
        id: cuisine.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const cuisine = await findEntityById(params.id, prisma.restaurant_Cuisine);
    await guardAdminAndAuthor(req, cuisine);

    await prisma.restaurant_Cuisine.delete({
      where: {
        id: cuisine.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const cuisine = await findEntityById(params.id, prisma.restaurant_Cuisine);
    await guardAdminAndAuthor(req, cuisine);

    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(data.file, "career-portal");

    await prisma.restaurant_Cuisine.update({
      where: {
        id: cuisine.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} image updated successfully`,
    });
  },
);
