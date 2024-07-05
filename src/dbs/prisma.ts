import { hashText } from "@/utils/bcrypt";
import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        create({ args, query }) {
          args.data = {
            ...args.data,
            password: hashText(args.data.password),
          };

          return query(args);
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// https://medium.com/@aliammariraq/prisma-exclude-with-typesafety-8484ea6d0c42
type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
