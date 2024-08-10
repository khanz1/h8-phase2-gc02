export type CustomResponse<T> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T | never;
};

export interface ApiResponse {
  statusCode: number;
}

export interface ApiResponseData<T> extends ApiResponse {
  data: T;
}

export interface ApiResponseMessage extends ApiResponse {
  message: string;
}

export type ProtectedParams = {
  searchParams: URLSearchParams;
  params: {
    id: string;
  };
};

export type PublicDetailParams = ProtectedParams;

export type OptionsQuery<T extends {} = {}> = {
  include?: {};
  where?: Record<string, T>;
  orderBy?: {};
  skip?: number;
  take?: number;
};
