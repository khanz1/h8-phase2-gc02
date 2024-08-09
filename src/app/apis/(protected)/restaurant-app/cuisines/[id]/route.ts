import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Restaurant_CuisineModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

const findCuisineById = async (id: string) => {
  const cuisine = await prisma.restaurant_Cuisine.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!cuisine) {
    throw new NotFoundError(ErrorMessage.CUISINE_NOT_FOUND);
  }

  return cuisine;
};

export const GET = withErrorHandler<Restaurant_Cuisine, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const cuisine = await findCuisineById(params.id);

    return NextResponse.json({
      statusCode: 200,
      data: cuisine,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const cuisine = await findCuisineById(params.id);
    const user = await guardAdminAndAuthor(cuisine, req);

    const requestBody = await getRequestBody(req);
    const data = await Restaurant_CuisineModel.parseAsync(requestBody);
    requestBody.categoryId = parseInt(requestBody.categoryId);
    requestBody.authorId = user.id;

    await prisma.restaurant_Cuisine.update({
      where: {
        id: cuisine.id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const cuisine = await findCuisineById(params.id);

    await guardAdminAndAuthor(cuisine, req);

    await prisma.restaurant_Cuisine.delete({
      where: {
        id: cuisine.id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const cuisine = await findCuisineById(params.id);

    await guardAdminAndAuthor(cuisine, req);

    const requestBody = await getRequestBody(req);
    const data = await PatchBodyFormData.parseAsync(requestBody);

    const base64 = await data.file.arrayBuffer();
    const base64String = Buffer.from(base64).toString("base64");

    // We will force upload to imagekit here
    const responseImagekit = await imageKit.upload({
      file: base64String,
      fileName: data.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["career-portal"],
    });

    await prisma.restaurant_Cuisine.update({
      where: {
        id: cuisine.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Cuisine id: ${cuisine.id} image updated successfully`,
    });
  },
);
