import prisma from "@/dbs/prisma";
import { UserModel } from "@/defs/zod";
import { validateRequestBody } from "@/utils/data-parser";
import { withErrorHandler } from "@/utils/with-error-handler";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await validateRequestBody(req, UserModel);

  data.role = UserRole.Staff;

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
