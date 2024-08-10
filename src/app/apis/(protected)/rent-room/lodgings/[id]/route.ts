import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Room_LodgingModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Lodging } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const lodging = await findEntityById(params.id, prisma.room_Lodging);

    return NextResponse.json<ApiResponseData<Room_Lodging>>({
      statusCode: 200,
      data: lodging,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const lodging = await findEntityById(params.id, prisma.room_Lodging);
    const user = await guardAdminAndAuthor(req, lodging);

    const data = await validateRequestBody(req, Room_LodgingModel, {
      authorId: user.id,
    });

    await prisma.room_Lodging.update({
      where: {
        id: lodging.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Lodging id: ${lodging.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const lodging = await findEntityById(params.id, prisma.room_Lodging);

    await guardAdminAndAuthor(req, lodging);

    await prisma.room_Lodging.delete({
      where: {
        id: lodging.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Lodging id: ${lodging.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const lodging = await findEntityById(params.id, prisma.room_Lodging);
    await guardAdminAndAuthor(req, lodging);

    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(data.file, "rent-room");

    await prisma.room_Lodging.update({
      where: {
        id: lodging.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Lodging id: ${lodging.id} image updated successfully`,
    });
  },
);
