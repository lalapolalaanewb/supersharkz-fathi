export interface APIDefaultResponse<T> {
  success: boolean;
  message: string;
  data?: string | T;
}

export interface ContentStatusType {
  isError: boolean;
  message: string;
}
