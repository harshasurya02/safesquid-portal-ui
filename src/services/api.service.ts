type ApiResponse<T = any> = Promise<T>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Common request handler
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>
): ApiResponse<T> {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include"
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

// POST
export const apiPost = <T>(
  endpoint: string,
  body: Record<string, unknown>
): ApiResponse<T> => apiRequest(endpoint, "POST", body);

// GET
export const apiGet = <T>(
  endpoint: string,
  params?: Record<string, string | number>
): ApiResponse<T> => {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";


  return apiRequest(endpoint + query, "GET");
};

// PUT
export const apiPut = <T>(
  endpoint: string,
  body: Record<string, unknown>
): ApiResponse<T> => apiRequest(endpoint, "PUT", body);

// DELETE
export const apiDelete = <T>(
  endpoint: string,
  body?: Record<string, unknown>
): ApiResponse<T> => apiRequest(endpoint, "DELETE", body);
