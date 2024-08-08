import prisma from "@/dbs/prisma";
import { UserModel } from "@/defs/zod";
import { compareHashWithText } from "@/utils/bcrypt";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { signPayload } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await parsingData(req);
    const parsedData = UserModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const foundUser = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (
      !foundUser ||
      !compareHashWithText(parsedData.data.password, foundUser.password)
    ) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload = {
      id: foundUser.id,
      role: foundUser.role,
    };

    const token = await signPayload(payload);

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
  } catch (err) {
    return errorCreator(err);
  }
};
