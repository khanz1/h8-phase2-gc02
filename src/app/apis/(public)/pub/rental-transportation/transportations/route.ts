import prisma from "@/dbs/prisma";
import { validatePublicSearchParams } from "@/defs/zod/x_custom_input";
import { getQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Rental_Transportation } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (_, params) => {
  const searchParams = await validatePublicSearchParams(params.searchParams);
  const options = getQueryOptions(searchParams, "name", "createdAt", "Type");

  const [transportations, rows] = await prisma.$transaction([
    prisma.rental_Transportation.findMany(options),
    prisma.rental_Transportation.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Rental_Transportation[]>>({
    statusCode: 200,
    data: getPaginatedResponse(transportations, searchParams, rows),
  });
});
