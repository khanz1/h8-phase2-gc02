import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Rental_TransportationModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Transportation } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

const findTransportationById = async (stringId: string) => {
  const id = parseInt(stringId);
  const transportation = await prisma.rental_Transportation.findUnique({
    where: {
      id,
    },
  });

  if (!transportation) {
    throw new NotFoundError(ErrorMessage.TRANSPORTATION_NOT_FOUND);
  }

  return { transportation, id };
};

export const GET = withErrorHandler<
  Rental_Transportation,
  ProtectedHandlerParams
>(async (_req, { params }) => {
  const { transportation } = await findTransportationById(params.id);

  return NextResponse.json({
    statusCode: 200,
    data: transportation,
  });
});

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const { transportation, id } = await findTransportationById(params.id);

    const user = await guardAdminAndAuthor(transportation, req);

    const requestBody = await getRequestBody(req);
    requestBody.typeId = parseInt(requestBody.typeId);
    requestBody.authorId = user.id;

    const data = await Rental_TransportationModel.parseAsync(requestBody);

    await prisma.rental_Transportation.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Transportation id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const { transportation, id } = await findTransportationById(params.id);

    await guardAdminAndAuthor(transportation, req);

    await prisma.rental_Transportation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Transportation id: ${id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const { transportation, id } = await findTransportationById(params.id);

    await guardAdminAndAuthor(transportation, req);

    const requestBody = await getRequestBody(req);
    const data = await PatchBodyFormData.parseAsync(requestBody);

    const base64 = await data.file.arrayBuffer();
    const base64String = Buffer.from(base64).toString("base64");

    // We will force upload to imagekit here
    const responseImagekit = await imageKit.upload({
      file: base64String,
      fileName: data.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["rental-transportation"],
    });

    await prisma.rental_Transportation.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Transportation id: ${id} image updated successfully`,
    });
  },
);
