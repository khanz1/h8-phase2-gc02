import * as ZodSchema from "@/defs/zod";
import { extractUserFromHeader } from "@/utils/data-parser";
import { ErrorMessage, ForbiddenError } from "@/utils/http-error";
import { NextRequest } from "next/server";
import { z } from "zod";

type InferZodTypes<T extends Record<string, z.ZodTypeAny>> = {
  [K in keyof T]: z.infer<T[K]>;
};
type ZodTypes = InferZodTypes<typeof ZodSchema>;

export const guardAdminAndAuthor = async <T extends ZodTypes[keyof ZodTypes]>(
  req: NextRequest,
  entity: T & { authorId: number },
) => {
  const user = extractUserFromHeader(req);

  if (user.role !== "Admin" && user.id !== entity.authorId) {
    throw new ForbiddenError(ErrorMessage.FORBIDDEN);
  }

  return user;
};
