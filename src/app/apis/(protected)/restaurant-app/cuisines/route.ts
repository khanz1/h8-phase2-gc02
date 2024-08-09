import prisma, { prismaExclude } from "@/dbs/prisma";
import { Restaurant_CuisineModel } from "@/defs/zod";
import { extractUserFromHeader, getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

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

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = extractUserFromHeader(req);

  const requestBody = await getRequestBody(req);
  requestBody.categoryId = parseInt(requestBody.categoryId);
  requestBody.authorId = user.id;

  const data = await Restaurant_CuisineModel.parseAsync(requestBody);

  const cuisine = await prisma.restaurant_Cuisine.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      data: cuisine,
    },
    {
      status: 201,
    },
  );
});
