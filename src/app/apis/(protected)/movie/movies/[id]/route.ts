import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Movie_MovieModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Movie } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const movie = await findEntityById(params.id, prisma.movie_Movie);

    return NextResponse.json<ApiResponseData<Movie_Movie>>({
      statusCode: 200,
      data: movie,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const movie = await findEntityById(params.id, prisma.movie_Movie);
    const user = await guardAdminAndAuthor(req, movie);
    const data = await validateRequestBody(req, Movie_MovieModel, {
      authorId: user.id,
    });

    await prisma.movie_Movie.update({
      where: {
        id: movie.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Movie id: ${movie.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const movie = await findEntityById(params.id, prisma.movie_Movie);

    await guardAdminAndAuthor(req, movie);

    await prisma.movie_Movie.delete({
      where: {
        id: movie.id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Movie id: ${movie.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const movie = await findEntityById(params.id, prisma.movie_Movie);
    await guardAdminAndAuthor(req, movie);
    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(data.file, "movie");

    await prisma.movie_Movie.update({
      where: {
        id: movie.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Movie id: ${movie.id} image updated successfully`,
    });
  },
);
