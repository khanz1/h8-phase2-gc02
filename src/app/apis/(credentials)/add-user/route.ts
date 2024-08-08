import prisma from "@/dbs/prisma";
import { UserModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await parsingData(req);
    const parsedData = UserModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    parsedData.data.role = "Staff";

    const responseDb = await prisma.user.create({
      data: parsedData.data,
    });

    return NextResponse.json(
      {
        statusCode: 201,
        message: "User created successfully",
        data: {
          id: responseDb.id,
          email: responseDb.email,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    return errorCreator(err);
  }
};
