import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Rental_TransportationModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Transportation } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const transportation = await findEntityById(
      params.id,
      prisma.rental_Transportation,
    );

    return NextResponse.json<ApiResponseData<Rental_Transportation>>({
      statusCode: 200,
      data: transportation,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const transportation = await findEntityById(
      params.id,
      prisma.rental_Transportation,
    );
    const user = await guardAdminAndAuthor(req, transportation);

    const data = await validateRequestBody(req, Rental_TransportationModel, {
      authorId: user.id,
    });

    await prisma.rental_Transportation.update({
      where: {
        id: transportation.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Transportation id: ${transportation.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const transportation = await findEntityById(
      params.id,
      prisma.rental_Transportation,
    );
    await guardAdminAndAuthor(req, transportation);

    await prisma.rental_Transportation.delete({
      where: {
        id: transportation.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Transportation id: ${transportation.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const transportation = await findEntityById(
      params.id,
      prisma.rental_Transportation,
    );
    await guardAdminAndAuthor(req, transportation);

    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(
      data.file,
      "rental-transportation",
    );

    await prisma.rental_Transportation.update({
      where: {
        id: transportation.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Transportation id: ${transportation.id} image updated successfully`,
    });
  },
);
