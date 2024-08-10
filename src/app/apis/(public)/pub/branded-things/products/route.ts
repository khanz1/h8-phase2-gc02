import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Product } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "description",
    "createdAt",
    "Category",
  );

  const [products, rows] = await prisma.$transaction([
    prisma.branded_Product.findMany(options),
    prisma.branded_Product.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Branded_Product[]>>({
    statusCode: 200,
    data: getPaginatedResponse(products, searchParams, rows),
  });
});
