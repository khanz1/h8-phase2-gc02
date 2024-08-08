import prisma, { prismaExclude } from "@/dbs/prisma";
import { CustomResponse } from "@/defs/custom-response";
import { UserJWTPayload } from "@/defs/jwt-payload";
import { Branded_ProductModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const query = await prisma.branded_Product.findMany({
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
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const headersUserData = req.headers.get("x-custom-data-user");

  if (!headersUserData) {
    throw new Error("INVALID_TOKEN");
  }

  const parsedHeadersUserData: Pick<UserJWTPayload, "id" | "role"> =
    JSON.parse(headersUserData);

  const requestData = await parsingData(req);
  requestData.categoryId = parseInt(requestData.categoryId);
  requestData.authorId = parsedHeadersUserData.id;

  const parsedData = Branded_ProductModel.safeParse(requestData);

  if (!parsedData.success) {
    throw parsedData.error;
  }

  const query = await prisma.branded_Product.create({
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
});
