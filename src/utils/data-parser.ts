import { OptionsQuery } from "@/defs/custom-response";
import { UserJWTPayload } from "@/defs/jwt-payload";
import { PublicGlobalSearchParams } from "@/defs/zod/x_custom_input";
import {
  BadRequestError,
  ErrorMessage,
  UnauthorizedError,
} from "@/utils/http-error";
import { NextRequest } from "next/server";
import { z, ZodSchema } from "zod";

/**
 * Regular expression to match strings ending with "Id" except for "userId".
 *
 * This regex matches any string that:
 * - Contains one or more letters (both lowercase and uppercase).
 * - Ends with "Id".
 * - Does not match the exact string "userId".
 *
 * The negative lookahead `(?!userId$)` ensures that "userId" is excluded from matches.
 *
 * Examples:
 * - "categoryId" matches.
 * - "typeId" matches.
 * - "genreId" matches.
 * - "userId" does not match.
 */
const idRegex = /^(?!userId$)[a-zA-Z]+Id$/;

export const extractUserFromHeader = (
  req: NextRequest,
): Pick<UserJWTPayload, "id" | "role"> => {
  const headersUserData = req.headers.get("x-custom-data-user");

  if (!headersUserData) {
    throw new UnauthorizedError(ErrorMessage.INVALID_TOKEN);
  }

  return JSON.parse(headersUserData);
};

export const getRequestBody = async (req: NextRequest) => {
  const contentType = req.headers.get("content-type");

  const isContentTypeJSON = contentType === "application/json";
  const isContentTypeForm = contentType === "application/x-www-form-urlencoded";
  const isContentTypeMultipart =
    contentType?.split(";")[0] === "multipart/form-data";

  if (isContentTypeJSON) {
    return await req.json();
  }

  if (isContentTypeForm || isContentTypeMultipart) {
    const form = await req.formData();
    return Object.fromEntries(form);
  }

  throw new BadRequestError(ErrorMessage.INVALID_CONTENT_TYPE);
};

export const validateRequestBody = async <T extends ZodSchema>(
  req: NextRequest,
  schema: T,
  additionalProps?: Record<string, unknown>,
): Promise<z.infer<T>> => {
  const requestBody = await getRequestBody(req);
  if (additionalProps) {
    for (const key in additionalProps) {
      if (idRegex.test(key)) {
        additionalProps[key] = parseInt(additionalProps[key] as string);
      }
      requestBody[key] = additionalProps[key];
    }
  }
  return await schema.parseAsync(requestBody);
};

export const validatePublicSearchParams = (req: NextRequest) => {
  // { q, i, sort, page, limit }
  const { searchParams } = new URL(req.nextUrl);

  const parsedSearchParams = PublicGlobalSearchParams.safeParse({
    q: searchParams.get("q"),
    i: searchParams.get("i"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  if (!parsedSearchParams.success) {
    throw parsedSearchParams.error;
  }

  return parsedSearchParams;
};

export const getSearchParamsAndQueryOptions = (
  req: NextRequest,
  searchColumn: string,
  sortingColumn: string,
  secondEntityName: string,
) => {
  const searchParams = validatePublicSearchParams(req);

  const options: OptionsQuery = {
    where: {},
    skip: (searchParams.data.page - 1) * searchParams.data.limit,
    take: searchParams.data.limit,
    orderBy: {
      [sortingColumn]: searchParams.data.sort,
    },
    include: {
      [secondEntityName]: true,
    },
  };

  if (searchParams.data.q) {
    options.where = {
      [searchColumn]: {
        contains: `%${searchParams.data.q}%`,
        mode: "insensitive",
      },
    };
  }

  if (searchParams.data.i) {
    options.where = {
      ...options.where,
      [secondEntityName]: {
        name: searchParams.data.i,
      },
    };
  }

  return { searchParams, options };
};
