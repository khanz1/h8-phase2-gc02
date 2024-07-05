import prisma, { prismaExclude } from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { UserJWTPayload } from "@/defs/jwt-payload";
import { Restaurant_CuisineModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.restaurant_Cuisine.findMany({
      include: {
        User: {
          select: prismaExclude("User", ["password"]),
        },
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const headersUserData = req.headers.get("x-custom-data-user");

    if (!headersUserData) {
      throw new Error("INVALID_TOKEN");
    }

    const parsedHeadersUserData: Pick<UserJWTPayload, "id" | "role"> =
      JSON.parse(headersUserData);

    const requestData = await parsingData(req);
    requestData.categoryId = parseInt(requestData.categoryId);
    requestData.authorId = parsedHeadersUserData.id;

    const parsedData = Restaurant_CuisineModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const query = await prisma.restaurant_Cuisine.create({
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<unknown>>(
      {
        statusCode: 201,
        data: query,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    return errorCreator(err);
  }
};
