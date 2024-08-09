import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Movie_MovieModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Movie } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

export const GET = withErrorHandler<Movie_Movie, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const movie = await prisma.movie_Movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: movie,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const user = await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    requestBody.genreId = parseInt(requestBody.genreId);
    requestBody.authorId = user.id;

    const data = await Movie_MovieModel.parseAsync(requestBody);

    await prisma.movie_Movie.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Movie id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    await prisma.movie_Movie.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Movie id: ${id} deleted successfully`,
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
      tags: ["movie"],
    });

    await prisma.movie_Movie.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Movie id: ${id} image updated successfully`,
    });
  },
);
