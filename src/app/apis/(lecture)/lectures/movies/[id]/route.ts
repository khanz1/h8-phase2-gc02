import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";
import { ProtectedParams } from "@/defs/custom-response";
import prisma from "@/dbs/prisma";
import { BadRequestError, ErrorMessage, NotFoundError } from "@/utils/http-error";
import { Lecture_MovieModel } from "@/defs/zod";
import { getRequestBody } from "@/utils/data-parser";

export const GET = withErrorHandler<ProtectedParams>(async (_, {params}) => {
  const movie = await prisma.lecture_Movie.findFirst({
    where: {
      id: Number(params.id)
    }
  })
  if (!movie) {
    throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND);
  }

  return NextResponse.json(movie);
})

export const PUT = withErrorHandler<ProtectedParams>(async (req, {params}) => {
  if (!params.id) {
    throw new BadRequestError('Id is not provided')
  }

  const body = await getRequestBody(req);

  const data = await Lecture_MovieModel.parseAsync(body);

  const movie = await prisma.lecture_Movie.findFirst({
    where: {
      id: Number(params.id)
    }
  })

  if (!movie) {
    throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND)
  }

  await prisma.lecture_Movie.update({
    where: {
      id: Number(params.id)
    },
    data,
  });

  return NextResponse.json(movie);
})

export const DELETE = withErrorHandler<ProtectedParams>(async (_, {params}) => {
  if (!params.id) {
    throw new BadRequestError('Id is not provided')
  }
  const movie = await prisma.lecture_Movie.findFirst({
    where: {
      id: Number(params.id)

    }
  })
  if (!movie) {
    throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND)
  }

  await prisma.lecture_Movie.delete({
    where: {
      id: Number(params.id)
    }
  });

  return NextResponse.json({
    message: `Movie ${movie.title} deleted successfully`,
  });
})