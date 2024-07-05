import prisma from "@/dbs/prisma";
import { CustomResponse, GlobalProtectedParams } from "@/defs/custom-response";
import { Restaurant_CuisineModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import imageKit from "@/utils/imagekit";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authorization } from "../authorization";

export const GET = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.restaurant_Cuisine.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("CUISINE_NOT_FOUND");
    }

    return NextResponse.json<CustomResponse<Restaurant_Cuisine>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const { parsedHeadersUserData } = await authorization(id, req);

    const requestData = await parsingData(req);
    requestData.categoryId = parseInt(requestData.categoryId);
    requestData.authorId = parsedHeadersUserData.id;

    const parsedData = Restaurant_CuisineModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    await prisma.restaurant_Cuisine.update({
      where: {
        id: parseInt(id),
      },
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Cuisine id: ${id} updated successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    await authorization(id, req);

    await prisma.restaurant_Cuisine.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Cuisine id: ${id} deleted successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    await authorization(id, req);

    const requestData = await parsingData(req);
    const parsedData = PatchBodyFormData.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const base64 = await parsedData.data.file.arrayBuffer();
    const base64String = Buffer.from(base64).toString("base64");

    // We will force upload to imagekit here
    const responseImagekit = await imageKit.upload({
      file: base64String,
      fileName: requestData.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["career-portal"],
    });

    await prisma.restaurant_Cuisine.update({
      where: {
        id: parseInt(id),
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Cuisine id: ${id} image updated successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
