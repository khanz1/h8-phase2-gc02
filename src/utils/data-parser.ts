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

export const validatePublicGlobalSearchParams = (req: NextRequest) => {
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
  let options: OptionsQuery<{}> = {};

  const parsedSearchParams = validatePublicGlobalSearchParams(req);

  if (parsedSearchParams.data.q) {
    options.where = {
      [searchColumn]: {
        contains: `%${parsedSearchParams.data.q}%`,
        mode: "insensitive",
      },
    };
  }

  if (parsedSearchParams.data.i) {
    options.where = {
      ...options.where,
      [secondEntityName]: {
        name: parsedSearchParams.data.i,
      },
    };
  }

  if (parsedSearchParams.data.sort) {
    options.orderBy = {
      [sortingColumn]: parsedSearchParams.data.sort.toLowerCase() || "asc",
    };
  }

  if (parsedSearchParams.data.page) {
    let limit = parsedSearchParams.data.limit
      ? parseInt(parsedSearchParams.data.limit.toString() || "10")
      : 10;

    let page = parseInt(parsedSearchParams.data.page.toString() || "1");

    options.skip = (page - 1) * limit;
  }

  options.include = {
    [secondEntityName]: true,
  };

  options.take = parsedSearchParams.data.limit
    ? parseInt(parsedSearchParams.data.limit.toString() || "10")
    : 10;

  return { parsedSearchParams, options };
};
