import prisma, { prismaExclude } from "@/dbs/prisma";
import { CustomResponse, GlobalPubParams } from "@/defs/custom-response";
import { errorCreator } from "@/utils/error-creator";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: GlobalPubParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.career_Job.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Company: {
          select: prismaExclude("Career_Company", ["id"]),
        },
        User: {
          select: prismaExclude("User", ["id", "password", "role"]),
        },
      },
    });

    if (!query) {
      throw new Error("JOB_NOT_FOUND");
    }

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
