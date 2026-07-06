export type ApiResponse<T> = {
  code: number;
  data: T | null;
  fieldErrors: { field: string; value: string; message: string }[];
  message: string;
  success: boolean;
  timestamp: string;
};
