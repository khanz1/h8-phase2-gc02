import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { Movie_GenreModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { Movie_Genre } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.movie_Genre.findMany();

    return NextResponse.json<CustomResponse<Movie_Genre[]>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const headersUserData = req.headers.get("x-custom-data-user");

    if (!headersUserData) {
      throw new Error("INVALID_TOKEN");
    }

    const requestData = await parsingData(req);
    const parsedData = Movie_GenreModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const query = await prisma.movie_Genre.create({
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<Movie_Genre>>(
      {
        statusCode: 201,
        data: query,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    return errorCreator(err);
  }
};
