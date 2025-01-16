export type NetworkError = {
  status?: number;
  code?: null;
  message?: string;
  details?: null;
};

export type ServerError = {
  status?: number;
  code: string;
  message?: string;
  details?: Record<string, unknown>;
};

export type APIError = ServerError | NetworkError;

export type APIResponse<T> =
  | {
      error: APIError;
      response?: null;
    }
  | {
      error?: null;
      response: T;
    };
