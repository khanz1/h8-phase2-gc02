import prisma from "@/dbs/prisma";
import { UserJWTPayload } from "@/defs/jwt-payload";
import { NextRequest } from "next/server";

export const authorization = async (id: string, req: NextRequest) => {
  const headersUserData = req.headers.get("x-custom-data-user");

  const query = await prisma.branded_Product.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!query) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (!headersUserData) {
    throw new Error("INVALID_TOKEN");
  }

  const parsedHeadersUserData: Pick<UserJWTPayload, "id" | "role"> =
    JSON.parse(headersUserData);

  if (
    parsedHeadersUserData.role !== "Admin" &&
    parsedHeadersUserData.id !== query.authorId
  ) {
    throw new Error("FORBIDDEN");
  }

  return { parsedHeadersUserData };
};
