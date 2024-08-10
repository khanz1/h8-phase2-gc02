import prisma, { prismaExclude } from "@/dbs/prisma";
import { ApiResponseData } from "@/defs/custom-response";
import { Restaurant_CuisineModel } from "@/defs/zod";
import {
  extractUserFromHeader,
  validateRequestBody,
} from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Restaurant_Cuisine } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const cuisines = await prisma.restaurant_Cuisine.findMany({
    include: {
      User: {
        select: prismaExclude("User", ["password"]),
      },
    },
  });

  return NextResponse.json({
    statusCode: 200,
    data: cuisines,
  });
});

export const POST = withErrorHandler(async (req) => {
  const user = extractUserFromHeader(req);
  const data = await validateRequestBody(req, Restaurant_CuisineModel, {
    authorId: user.id,
  });

  const cuisine = await prisma.restaurant_Cuisine.create({
    data,
  });

  return NextResponse.json<ApiResponseData<Restaurant_Cuisine>>(
    {
      statusCode: 201,
      data: cuisine,
    },
    {
      status: 201,
    },
  );
});
