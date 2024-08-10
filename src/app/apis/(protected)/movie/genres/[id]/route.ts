import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Movie_GenreModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Movie_Genre } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const genre = await findEntityById(params.id, prisma.movie_Genre);

    return NextResponse.json<ApiResponseData<Movie_Genre>>({
      statusCode: 200,
      data: genre,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const data = await validateRequestBody(req, Movie_GenreModel);
    const genre = await findEntityById(params.id, prisma.movie_Genre);

    await prisma.movie_Genre.update({
      where: {
        id: genre.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Genre id: ${genre.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const genre = await findEntityById(params.id, prisma.movie_Genre);

    await prisma.movie_Genre.delete({
      where: {
        id: genre.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Genre id: ${genre.id} deleted successfully`,
    });
  },
);
