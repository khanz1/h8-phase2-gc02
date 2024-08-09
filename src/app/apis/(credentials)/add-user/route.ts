import prisma from "@/dbs/prisma";
import { UserModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const requestBody = await getRequestBody(req);
  const data = await UserModel.parseAsync(requestBody);

  data.role = "Staff";

  const user = await prisma.user.create({
    data,
  });

  return NextResponse.json(
    {
      statusCode: 201,
      message: "User created successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    },
    {
      status: 201,
    },
  );
});
