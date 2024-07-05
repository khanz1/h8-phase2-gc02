import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { Restaurant_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.restaurant_Category.findMany();

    return NextResponse.json<CustomResponse<Restaurant_Category[]>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
