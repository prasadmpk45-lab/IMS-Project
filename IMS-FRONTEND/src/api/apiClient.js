const BASE_URL = 'https://trimestral-flusteredly-patrice.ngrok-free.dev/api'

function buildUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  return `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (response.status === 204) {
    return null
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

function getErrorMessage(payload, fallback) {
  if (!payload) {
    return fallback
  }

  if (typeof payload === 'string') {
    return payload
  }

  return payload.message || payload.error || payload.title || fallback
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const { body, headers = {}, ...restOptions } = options
  const isFormData = body instanceof FormData

  try {
    const response = await fetch(buildUrl(endpoint), {
      ...restOptions,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${token || ''}`,
        'ngrok-skip-browser-warning': 'true',
        ...headers,
      },
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    })

    const data = await parseResponse(response)

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: getErrorMessage(data, `Request failed with status ${response.status}`),
        status: response.status,
      }
    }

    return {
      success: true,
      data,
      error: null,
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Network request failed',
      status: 0,
    }
  }
}

export default apiRequest
