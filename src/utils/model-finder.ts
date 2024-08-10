import prisma from "@/dbs/prisma";
import { NotFoundError } from "@/utils/http-error";

type PrismaKeys = keyof typeof prisma;

type FilteredPrismaKeys = Extract<
  PrismaKeys,
  `${Lowercase<string>}_${Capitalize<string>}`
>;

type FilteredPrismaTypes = {
  [K in FilteredPrismaKeys]: (typeof prisma)[K];
};

// TODO: Fix the type of the `model` parameter
export const findEntityById = async <
  T extends FilteredPrismaTypes[FilteredPrismaKeys] & {
    findUnique: (args: any) => Promise<any | null>;
  },
  ReturnType = T extends { findUnique: (args: any) => Promise<infer U | null> }
    ? U
    : never,
>(
  entityId: string,
  model: T,
): Promise<ReturnType> => {
  const category = await model.findUnique({
    where: {
      id: parseInt(entityId),
    },
  });

  if (!category) {
    // TODO: Fix the error message, it should be fixed when the `model` parameter is fixed
    throw new NotFoundError(`${(model as any)?.name?.split("_")[1]} Not Found`);
  }

  return category;
};
