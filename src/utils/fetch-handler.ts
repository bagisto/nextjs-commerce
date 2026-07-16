type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchHandlerOptions<TBody = unknown> {
  url: string;
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
  contentType?: boolean;
}

interface FetchHandlerResponse<T = unknown> {
  data: T | null;
  error?: { status?: number; message: string };
}

export async function fetchHandler<T = unknown>({
  url,
  method = "GET",
  body,
  headers = {},
  contentType = true,
  
}: FetchHandlerOptions): Promise<FetchHandlerResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      ...(contentType ? { "Content-Type": "application/json" } : {}),
      ...headers,
    };

    const response = await fetch(`/api/${url}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    
      
    const result = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: {
          status: response?.status,
          message: result?.error || "Something went wrong",
        },
      };
    }
    return {
      ...result,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";

    return {
      data: null,
      error: {
        message: error,
      },
    };
  }
}
