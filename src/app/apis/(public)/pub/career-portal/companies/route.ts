import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { Career_Company } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.career_Company.findMany();

    return NextResponse.json<CustomResponse<Career_Company[]>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
