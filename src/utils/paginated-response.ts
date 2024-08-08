import { createParsedSearchParamsAndOptionQuery } from "@/utils/data-parser";

type ParsedSearchParamsQuery = ReturnType<
  typeof createParsedSearchParamsAndOptionQuery
>["parsedSearchParams"];

export const getPaginatedResponse = <
  T extends Record<string, unknown>[],
  U extends ParsedSearchParamsQuery,
>(
  query: T,
  parsedSearchParams: U,
  rows: number,
) => {
  return {
    query,
    pagination: {
      currentPage: parsedSearchParams.data.page,
      totalPage: Math.ceil(rows / parsedSearchParams.data.limit),
      totalRows: rows,
    },
  };
};
