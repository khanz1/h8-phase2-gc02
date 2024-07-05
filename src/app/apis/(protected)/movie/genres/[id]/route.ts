import prisma from "@/dbs/prisma";
import { CustomResponse, GlobalProtectedParams } from "@/defs/custom-response";
import { Movie_GenreModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { Movie_Genre } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.movie_Genre.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("MOVIE_NOT_FOUND");
    }

    return NextResponse.json<CustomResponse<Movie_Genre>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const requestData = await parsingData(req);
    const parsedData = Movie_GenreModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const query = await prisma.movie_Genre.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("GENRE_NOT_FOUND");
    }

    await prisma.movie_Genre.update({
      where: {
        id: parseInt(id),
      },
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Genre id: ${id} updated successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.movie_Genre.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("GENRE_NOT_FOUND");
    }

    await prisma.movie_Genre.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Genre id: ${id} deleted successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
