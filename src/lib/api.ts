// Use VITE_API_URL from environment variables — set this in .env for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Parse JSON
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (e.g., clear token)
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new ApiError(response.status, data?.detail || data?.message || 'An error occurred', data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error', error);
  }
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  put: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
