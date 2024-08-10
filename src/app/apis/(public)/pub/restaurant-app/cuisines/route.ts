import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "name",
    "createdAt",
    "Category",
  );

  const [cuisines, rows] = await prisma.$transaction([
    prisma.restaurant_Cuisine.findMany(options),
    prisma.restaurant_Cuisine.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Restaurant_Cuisine[]>>({
    statusCode: 200,
    data: getPaginatedResponse(cuisines, searchParams, rows),
  });
});
