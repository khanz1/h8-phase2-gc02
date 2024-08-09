import prisma from "@/dbs/prisma";
import { ProtectedHandlerParams } from "@/defs/custom-response";
import { Career_JobModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { getRequestBody } from "@/utils/data-parser";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import imageKit from "@/utils/imagekit";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Job } from "@prisma/client";
import { NextResponse } from "next/server";
import { guardAdminAndAuthor } from "../authorization";

export const GET = withErrorHandler<Career_Job, ProtectedHandlerParams>(
  async (_req, { params }) => {
    const id = parseInt(params.id);

    const job = await prisma.career_Job.findUnique({
      where: {
        id,
      },
    });

    if (!job) {
      throw new NotFoundError(ErrorMessage.JOB_NOT_FOUND);
    }

    return NextResponse.json({
      statusCode: 200,
      data: job,
    });
  },
);

export const PUT = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    const user = await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    requestBody.companyId = parseInt(requestBody.companyId);
    requestBody.authorId = user.id;

    const data = await Career_JobModel.parseAsync(requestBody);

    await prisma.career_Job.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Job id: ${id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    await prisma.career_Job.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Job id: ${id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<null, ProtectedHandlerParams>(
  async (req, { params }) => {
    const id = parseInt(params.id);

    await guardAdminAndAuthor(id, req);

    const requestBody = await getRequestBody(req);
    const data = await PatchBodyFormData.parseAsync(requestBody);

    const base64 = await data.file.arrayBuffer();
    const base64String = Buffer.from(base64).toString("base64");

    // We will force upload to imagekit here
    const responseImagekit = await imageKit.upload({
      file: base64String,
      fileName: data.file.name,
      folder: "phase2/challenge/all-in-one",
      tags: ["career-portal"],
    });

    await prisma.career_Job.update({
      where: {
        id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      message: `Job id: ${id} image updated successfully`,
    });
  },
);
