// =============================================================
// CIA API CONFIGURATION
// =============================================================
// 
// Set your API endpoint URL here. This is where your chat
// messages will be sent via POST request.
//
// Your API should accept:
//   POST request with JSON body: { "message": "user prompt" }
//
// Your API should return:
//   JSON response with the assistant's reply
//   Expected format: { "response": "assistant message" }
//   Or plain text response
//
// =============================================================
import { fetchAuthSession } from 'aws-amplify/auth';

export const API_CONFIG = {
  // Proxy route - avoids CORS issues by routing through Next.js server
  endpoint: '/api/chat',

  // Request timeout in milliseconds (default: 60 seconds)
  timeout: 60000,

  // Additional headers (optional)
  headers: {
    'Content-Type': 'application/json',
  },
}

// Helper function to call your API
export async function sendMessageToAPI(
  message: string,
  sessionId?: string,
  password?: string
): Promise<{ text: string; sessionId?: string }> {
  const { endpoint, timeout, headers } = API_CONFIG

  if (!endpoint) {
    throw new Error(
      `API endpoint not configured. ${endpoint}Please set NEXT_PUBLIC_CIA_API_URL in your environment variables or update lib/api-config.ts`
    )
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const body: Record<string, unknown> = { message }
    if (sessionId) {
      body.session_id = sessionId
    }
    if (password) {
      body.password = password
    }

    // Get JWT from Cognito
    let authHeaders: Record<string, string> = { ...headers }
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {
      console.warn('No active auth session found for JWT propagation', e)
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(body),
      signal: controller.signal,
    })


    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API request failed with status ${response.status}. Error details: ${errorText}`)
    }

    // Try to parse as JSON first
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      const text = data.response || data.message || data.content || data.text || JSON.stringify(data)
      return { text, sessionId: data.session_id ?? undefined }
    }

    // Fall back to plain text
    const text = await response.text()
    return { text }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.')
      }
      throw error
    }

    throw new Error(`An unexpected error occurred: ${String(error)}`)
  }
}
