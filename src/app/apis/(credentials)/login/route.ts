import prisma from "@/dbs/prisma";
import { UserModel } from "@/defs/zod";
import { compareHashWithText } from "@/utils/bcrypt";
import { validateRequestBody } from "@/utils/data-parser";
import { ErrorMessage, UnauthorizedError } from "@/utils/http-error";
import { signPayload } from "@/utils/jwt";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await validateRequestBody(req, UserModel);

  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new UnauthorizedError(ErrorMessage.INVALID_LOGIN);
  }

  const isValidPassword = compareHashWithText(data.password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError(ErrorMessage.INVALID_LOGIN);
  }

  const token = await signPayload({
    id: user.id,
    role: user.role,
  });

  return NextResponse.json(
    {
      statusCode: 200,
      message: "Login success",
      data: {
        access_token: token,
      },
    },
    {
      status: 200,
    },
  );
});
