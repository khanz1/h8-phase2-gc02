import { OptionsQuery } from "@/defs/custom-response";
import { PublicGlobalSearchParams } from "@/defs/zod/x_custom_input";
import { NextRequest } from "next/server";

export const parsingData = async (req: NextRequest) => {
  let data;

  if (req.headers.get("content-type") === "application/json") {
    data = await req.json();
  } else if (
    req.headers.get("content-type") === "application/x-www-form-urlencoded" ||
    req.headers.get("content-type")?.split(";")[0] === "multipart/form-data"
  ) {
    data = await req.formData();
    data = Object.fromEntries(data);
  } else {
    throw new Error("INVALID_CONTENT_TYPE");
  }

  return data;
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

export const createParsedSearchParamsAndOptionQuery = (
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

  return { parsedSearchParams: searchParams, options };
};
