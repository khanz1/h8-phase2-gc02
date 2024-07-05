import prisma from "@/dbs/prisma";
import { CustomResponse, GlobalProtectedParams } from "@/defs/custom-response";
import { Career_CompanyModel } from "@/defs/zod";
import { parsingData } from "@/utils/data-parser";
import { errorCreator } from "@/utils/error-creator";
import { Career_Company } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.career_Company.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    return NextResponse.json<CustomResponse<Career_Company>>({
      statusCode: 200,
      data: query,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const requestData = await parsingData(req);
    const parsedData = Career_CompanyModel.safeParse(requestData);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const query = await prisma.career_Company.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    await prisma.career_Company.update({
      where: {
        id: parseInt(id),
      },
      data: parsedData.data,
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Company id: ${id} updated successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: GlobalProtectedParams },
) => {
  try {
    const { id } = params;

    const query = await prisma.career_Company.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    await prisma.career_Company.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json<CustomResponse<unknown>>({
      statusCode: 200,
      message: `Company id: ${id} deleted successfully`,
    });
  } catch (err) {
    return errorCreator(err);
  }
};
