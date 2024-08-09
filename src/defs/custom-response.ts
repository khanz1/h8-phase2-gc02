export type CustomResponse<T> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T | never;
};

export type ApiResponse<T = undefined> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T;
};

export type ProtectedHandlerParams = {
  params: {
    id: string;
  };
};

export type ResponseMessage = {
  message: string;
};

export type GlobalPubParams = {
  id: string;
};

export type GlobalProtectedParams = {
  id: string;
};

export type OptionsQuery<T extends {} = {}> = {
  include?: {};
  where?: Record<string, T>;
  orderBy?: {};
  skip?: number;
  take?: number;
};
