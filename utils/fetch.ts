export const normalFetch = async (
  url: string,
  method: "get" | "post" | "put" | "delete",
  body?: any,
  headers?: Record<string, string>
) => {
  const defaultHeaders: Record<string, string> = {};

  if (body && !(body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  return response;
};