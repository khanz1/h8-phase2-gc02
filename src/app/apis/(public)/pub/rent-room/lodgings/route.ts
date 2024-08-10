import prisma from "@/dbs/prisma";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";
import {
  getPaginatedResponse,
  PaginatedApiResponse,
} from "@/utils/paginated-response";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Room_Lodging } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { searchParams, options } = getSearchParamsAndQueryOptions(
    req,
    "name",
    "createdAt",
    "Type",
  );

  const [lodgings, rows] = await prisma.$transaction([
    prisma.room_Lodging.findMany(options),
    prisma.room_Lodging.count({
      where: options.where,
    }),
  ]);

  return NextResponse.json<PaginatedApiResponse<Room_Lodging[]>>({
    statusCode: 200,
    data: getPaginatedResponse(lodgings, searchParams, rows),
  });
});
