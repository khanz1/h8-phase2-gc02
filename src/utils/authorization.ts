import prisma from "@/dbs/prisma";
import { extractUserFromHeader } from "@/utils/data-parser";
import {
  ErrorMessage,
  ForbiddenError,
  NotFoundError,
} from "@/utils/http-error";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import ModelName = Prisma.ModelName;

type TPrisma = typeof prisma;
// type LowercaseKeys<T> = {
//   [K in keyof T as K extends string ? Lowercase<K> : K]: T[K];
// };
// type L = LowercaseKeys<typeof Prisma.ModelName>;

type CapitalizeAfterUnderscore<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}_${Capitalize<Rest>}`
    : Lowercase<S>;

type TransformedTPrisma = {
  [K in keyof typeof ModelName as CapitalizeAfterUnderscore<K & string>]: K;
};
type z = keyof TransformedTPrisma;

const data: z = "restaurant_Category";

export const guardAdminAndAuthor = async <T extends (typeof prisma)[z]>(
  req: NextRequest,
  id: number,
  model: T,
  notFoundMessage: ErrorMessage,
) => {
  const user = extractUserFromHeader(req);

  const product = await model.findFirst({
    where: {
      id,
    },
  });

  if (!product) {
    throw new NotFoundError(notFoundMessage);
  }

  if (user.role !== "Admin" && user.id !== product.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
