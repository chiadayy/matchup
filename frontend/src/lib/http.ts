/**
 * Axios HTTP client with authentication interceptors
 * Handles access token management and automatic refresh on 401
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// In-memory token store (not persisted)
let accessToken: string | null = null

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return accessToken
}

/**
 * Set access token
 */
export function setAccessToken(token: string | null): void {
  accessToken = token
}

/**
 * Clear access token
 */
export function clearAccessToken(): void {
  accessToken = null
}

// Create axios instance
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Send cookies (refresh token)
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request interceptor - adds Authorization header
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - handles 401 and automatic token refresh
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return http(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Try to refresh the access token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = response.data.accessToken
        setAccessToken(newAccessToken)

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)

        // Retry original request
        return http(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as Error, null)
        clearAccessToken()

        // Redirect to login (router will handle this via navigation guard)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default http
