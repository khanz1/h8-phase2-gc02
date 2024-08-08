import prisma from "@/dbs/prisma";
import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { getPaginatedResponse } from "@/utils/paginated-response";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { parsedSearchParams, options } =
      createParsedSearchParamsAndOptionQuery(req, "name", "createdAt", "Type");

    const [query, rows] = await prisma.$transaction([
      prisma.rental_Transportation.findMany(options),
      prisma.rental_Transportation.count({
        where: options.where,
      }),
    ]);

    return NextResponse.json({
      statusCode: 200,
      data: getPaginatedResponse(query, parsedSearchParams, rows),
    });
  } catch (err) {
    return errorCreator(err);
  }
};
