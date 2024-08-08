export type CustomResponse<T> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T | never;
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
