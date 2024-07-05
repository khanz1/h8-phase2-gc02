export type CustomResponse<T> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T;
};

export type GlobalPubParams = {
  id: string;
};

export type GlobalProtectedParams = {
  id: string;
};

export type OptionsQuery<T> = {
  include?: {};
  where?: Record<string, T>;
  orderBy?: {};
  skip?: number;
  take?: number;
};
