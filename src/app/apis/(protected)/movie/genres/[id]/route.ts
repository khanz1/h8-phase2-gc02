import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Movie_GenreModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Genre } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<Movie_Genre, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const genre = await prisma.movie_Genre.findUnique({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new NotFoundError(ErrorMessage.GENRE_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: genre,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const requestBody = await getRequestBody(req);
    const data = await Movie_GenreModel.parseAsync(requestBody);

    const genre = await prisma.movie_Genre.findUnique({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new NotFoundError(ErrorMessage.GENRE_NOT_FOUND);
    }

    await prisma.movie_Genre.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Genre id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const genre = await prisma.movie_Genre.findUnique({
      where: {
        id,
      },
    });

    if (!genre) {
      throw new NotFoundError(ErrorMessage.GENRE_NOT_FOUND);
    }

    await prisma.movie_Genre.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Genre id: ${id} deleted successfully`,
    });
  },
);
