import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Room_LodgingModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Lodging } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

export const GET = withErrorHandler<Room_Lodging, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const lodging = await prisma.room_Lodging.findUnique({
      where: {
        id,
      },
    });

    if (!lodging) {
      throw new NotFoundError(ErrorMessage.LODGING_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: lodging,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const user = await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    requestBody.typeId = parseInt(requestBody.typeId);
    requestBody.authorId = user.id;

    const data = await Room_LodgingModel.parseAsync(requestBody);

    await prisma.room_Lodging.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Lodging id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    await prisma.room_Lodging.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Lodging id: ${id} deleted successfully`,
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
      fileName: data.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["rent-room"],
    });

    await prisma.room_Lodging.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Lodging id: ${id} image updated successfully`,
    });
  },
);
