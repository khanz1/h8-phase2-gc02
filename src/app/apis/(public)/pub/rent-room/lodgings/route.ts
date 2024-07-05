import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { parsedSearchParams, options } =
      createParsedSearchParamsAndOptionQuery(req, "name", "createdAt", "Type");

    const [query, rows] = await prisma.$transaction([
      prisma.room_Lodging.findMany(options),
      prisma.room_Lodging.count({
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
