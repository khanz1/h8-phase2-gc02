import prisma from "@/dbs/prisma";
import {
  ApiResponseData,
  ApiResponseMessage,
  ProtectedParams,
} from "@/defs/custom-response";
import { Career_JobModel } from "@/defs/zod";
import { PatchBodyFormData } from "@/defs/zod/x_custom_input";
import { guardAdminAndAuthor } from "@/utils/authorization";
import { validateRequestBody } from "@/utils/data-parser";
import { findEntityById } from "@/utils/model-finder";
import { uploadImage } from "@/utils/upload-image";
import { withErrorHandler } from "@/utils/with-error-handler";
import { Career_Job } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<ProtectedParams>(
  async (_req, { params }) => {
    const job = await findEntityById(params.id, prisma.career_Job);

    return NextResponse.json<ApiResponseData<Career_Job>>({
      statusCode: 200,
      data: job,
    });
  },
);

export const PUT = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const job = await findEntityById(params.id, prisma.career_Job);
    const user = await guardAdminAndAuthor(req, job);
    const data = await validateRequestBody(req, Career_JobModel, {
      authorId: user.id,
    });

    await prisma.career_Job.update({
      where: {
        id: job.id,
      },
      data,
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Job id: ${job.id} updated successfully`,
    });
  },
);

export const DELETE = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const job = await findEntityById(params.id, prisma.career_Job);

    await guardAdminAndAuthor(req, job);

    await prisma.career_Job.delete({
      where: {
        id: job.id,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Job id: ${job.id} deleted successfully`,
    });
  },
);

export const PATCH = withErrorHandler<ProtectedParams>(
  async (req, { params }) => {
    const job = await findEntityById(params.id, prisma.career_Job);
    await guardAdminAndAuthor(req, job);
    const data = await validateRequestBody(req, PatchBodyFormData);
    const responseImagekit = await uploadImage(data.file, "career-portal");

    await prisma.career_Job.update({
      where: {
        id: job.id,
      },
      data: {
        imgUrl: responseImagekit.url,
      },
    });

    return NextResponse.json<ApiResponseMessage>({
      statusCode: 200,
      message: `Job id: ${job.id} image updated successfully`,
    });
  },
);
