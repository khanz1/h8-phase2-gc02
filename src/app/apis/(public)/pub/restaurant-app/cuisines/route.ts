import prisma from "@/dbs/prisma";
import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
import { getQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (_, params) => {
  const searchParams = await validatePublicSearchParams(params.searchParams);
  const options = getQueryOptions(
    searchParams,
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
