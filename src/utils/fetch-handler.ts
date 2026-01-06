type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchHandlerOptions<TBody = unknown> {
  url: string; // API route, e.g., "addToCart"
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
  contentType?: boolean;
}

export async function fetchHandler({
  url,
  method = "GET",
  body,
  headers = {},
  contentType = true,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: FetchHandlerOptions): Promise<any> {
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
