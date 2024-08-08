import prisma from "@/dbs/prisma";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const query = await prisma.branded_Category.findMany();

  return NextResponse.json({
    statusCode: 200,
    data: query,
  });
});
