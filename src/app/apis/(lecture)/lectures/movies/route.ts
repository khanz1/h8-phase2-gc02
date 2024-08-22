import prisma from "@/dbs/prisma";
import { NextResponse } from "next/server";
import { Lecture_MovieModel } from "@/defs/zod";
import { withErrorHandler } from "@/utils/with-error-handler";
import { getRequestBody } from "@/utils/data-parser";

export const GET = withErrorHandler(async () => {
  const movie = await prisma.lecture_Movie.findMany();

  return NextResponse.json(movie);
});

export const POST = withErrorHandler(async (req) => {
  const body = await getRequestBody(req);

  const data = await Lecture_MovieModel.parseAsync(body);
  const movie = await prisma.lecture_Movie.create({
    data,
  });

  return NextResponse.json(movie);
})
