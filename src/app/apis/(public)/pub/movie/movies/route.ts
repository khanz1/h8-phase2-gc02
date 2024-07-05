import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { parsedSearchParams, options } =
      createParsedSearchParamsAndOptionQuery(
        req,
        "title",
        "createdAt",
        "Genre",
      );

    const [query, rows] = await prisma.$transaction([
      prisma.movie_Movie.findMany(options),
      prisma.movie_Movie.count({
        where: options.where,
      }),
    ]);

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      data: {
        query: [...query],
        pagination: {
          currentPage: parsedSearchParams.data.page
            ? parseInt(parsedSearchParams.data.page.toString() || "1")
            : 1,
          totalPage: Math.ceil(
            rows /
              (parsedSearchParams.data.limit
                ? parseInt(parsedSearchParams.data.limit.toString() || "10")
                : 10),
          ),
          totalRows: rows,
        },
      },
    });
  } catch (err) {
    return errorCreator(err);
  }
};
