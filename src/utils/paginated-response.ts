import { ApiResponseData } from "@/defs/custom-response";
import { getSearchParamsAndQueryOptions } from "@/utils/data-parser";

type SearchParamsQuery = ReturnType<
  typeof getSearchParamsAndQueryOptions
>["searchParams"];

export interface PaginatedApiResponse<T>
  extends ApiResponseData<{
    query: T;
    pagination: {
      currentPage: number;
      totalPage: number;
      totalRows: number;
    };
  }> {}

export const getPaginatedResponse = <
  T extends Record<string, unknown>[],
  U extends SearchParamsQuery,
>(
  query: T,
  searchParams: U,
  rows: number,
) => {
  return {
    query,
    pagination: {
      currentPage: searchParams.data.page,
      totalPage: Math.ceil(rows / searchParams.data.limit),
      totalRows: rows,
    },
  };
};
