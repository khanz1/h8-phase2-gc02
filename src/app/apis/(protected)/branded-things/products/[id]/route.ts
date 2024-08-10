import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Branded_ProductModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Product } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const product = await findEntityById(params.id, prisma.branded_Product);

    return NextResponse.json<ApiResponseData<Branded_Product>>({
      statusCode: 200,
      data: product,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const product = await findEntityById(params.id, prisma.branded_Product);
    const user = await guardAdminAndAuthor(req, product);
    const data = await validateRequestBody(req, Branded_ProductModel, {
      authorId: user.id,
    });

    await prisma.branded_Product.update({
      where: {
        id: product.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Product id: ${product.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const product = await findEntityById(params.id, prisma.branded_Product);
    await guardAdminAndAuthor(req, product);

    await prisma.branded_Product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Product id: ${product.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const product = await findEntityById(params.id, prisma.branded_Product);
    await guardAdminAndAuthor(req, product);

    const data = await validateRequestBody(req, PatchBodyFormData);

    const responseImagekit = await uploadImage(data.file, "branded-things");

    await prisma.branded_Product.update({
      where: {
        id: product.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Product id: ${product.id} image updated successfully`,
    });
  },
);
