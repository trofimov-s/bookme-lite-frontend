import type { AxiosError } from 'axios';

export type ApiError = {
  message: string | string[];
  statusCode: number;
};

export class TypedApiError extends Error {
  code: number;
  apiFullError: AxiosError<ApiError>;
  messages: string[];

  constructor(messages: string | string[], code: number, error: AxiosError<ApiError>) {
    const messagesArray = Array.isArray(messages) ? messages : [messages];

    super(messagesArray.join(', '));

    this.messages = messagesArray;
    this.code = code;
    this.apiFullError = error;
    this.name = 'TypedApiError';
  }
}
