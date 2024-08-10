import prisma, { prismaExclude } from "@/dbs/prisma";
import { PublicParams } from "@/defs/custom-response";
import { ErrorMessage, NotFoundError } from "@/utils/http-error";
import { withErrorHandler } from "@/utils/with-error-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler<PublicParams>(async (_req, { params }) => {
  const id = parseInt(params.id);

  const query = await prisma.movie_Movie.findUnique({
    where: {
      id,
    },
    include: {
      Genre: {
        select: prismaExclude("Movie_Genre", ["id"]),
      },
      User: {
        select: prismaExclude("User", ["id", "password", "role"]),
      },
    },
  });

  if (!query) {
    throw new NotFoundError(ErrorMessage.MOVIE_NOT_FOUND);
  }

  return NextResponse.json({
    statusCode: 200,
    data: query,
  });
});
