import { ApiResponseData } from "@/defs/custom-response";
import { TPublicSearchParams } from "@/defs/zod/x_custom_input";

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
  U extends TPublicSearchParams,
>(
  query: T,
  searchParams: U,
  rows: number,
) => {
  return {
    query,
    pagination: {
      currentPage: searchParams.page,
      totalPage: Math.ceil(rows / searchParams.limit),
      totalRows: rows,
    },
  };
};
