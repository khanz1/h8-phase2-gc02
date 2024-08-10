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

export type ProtectedHandlerParams = {
  params: {
    id: string;
  };
};

export type ProtectedParams = {
  params: {
    id: string;
  };
};

export type PublicParams = ProtectedParams;

export type OptionsQuery<T extends {} = {}> = {
  include?: {};
  where?: Record<string, T>;
  orderBy?: {};
  skip?: number;
  take?: number;
};
