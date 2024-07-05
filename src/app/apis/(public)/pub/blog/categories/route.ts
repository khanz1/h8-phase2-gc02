import prisma from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { Blog_Category } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const query = await prisma.blog_Category.findMany();

    return NextResponse.json<CustomResponse<Blog_Category[]>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
