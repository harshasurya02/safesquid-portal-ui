import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type ApiResponse<T = any> = Promise<T>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Server-side request handler
async function apiRequestServer<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
  customOptions?: RequestInit,
  cookieStore?: ReadonlyRequestCookies
): ApiResponse<T> {
  let cookieHeader = "";
  let sessionToken = "";

  if (cookieStore) {
    cookieHeader = cookieStore
      .getAll()
      .map((cookie: any) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    sessionToken = cookieStore.get("session_token")?.value || "";
  }

  // console.log(cookieHeader);

  if (cookieStore) {
    console.log(
      "t:",
      cookieStore.getAll().map((cookie: any) => cookie.name)
    );
  }

  const { headers, ...remainingOptions } = customOptions || {};

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }),
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
      ...headers,
    },
    ...remainingOptions,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// GET
export const apiGetServer = async <T>(
  endpoint: string,
  params?: Record<string, string | number>,
  options?: RequestInit,
  cookieStore?: any
): ApiResponse<T> => {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiRequestServer(
    endpoint + query,
    "GET",
    undefined,
    options,
    cookieStore
  );
};
