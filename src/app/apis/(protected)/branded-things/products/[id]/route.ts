import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Branded_ProductModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Product } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

export const GET = withErrorHandler<Branded_Product, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const product = await prisma.branded_Product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: product,
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

    const data = await Branded_ProductModel.parseAsync(requestBody);

    await prisma.branded_Product.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Product id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    await prisma.branded_Product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Product id: ${id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    const data = await PatchBodyFormData.parseAsync(requestBody);

    const base64 = await data.file.arrayBuffer();
    const base64String = Buffer.from(base64).toString("base64");

    // We will force upload to imagekit here
    const responseImagekit = await imageKit.upload({
      file: base64String,
      fileName: requestBody.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["branded-things"],
    });

    await prisma.branded_Product.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Product id: ${id} image updated successfully`,
    });
  },
);
