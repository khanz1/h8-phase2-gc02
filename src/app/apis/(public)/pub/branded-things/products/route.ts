import prisma from "@/dbs/prisma";
import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
import { getQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Branded_Product } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (_, params) => {
  const searchParams = await validatePublicSearchParams(params.searchParams);
  const options = getQueryOptions(
    searchParams,
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
