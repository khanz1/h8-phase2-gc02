import prisma from "@/dbs/prisma";
import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";
import { getPaginatedResponse } from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { parsedSearchParams, options } =
    createParsedSearchParamsAndOptionQuery(
      req,
      "name",
      "createdAt",
      "Category",
    );

  const [query, rows] = await prisma.$transaction([
    prisma.restaurant_Cuisine.findMany(options),
    prisma.restaurant_Cuisine.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json({
    statusCode: 200,
    data: getPaginatedResponse(query, parsedSearchParams, rows),
  });
});
