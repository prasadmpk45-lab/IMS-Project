import { apiRequest } from './apiClient'

export function getAllVariants() {
  return apiRequest('/productvariants')
}

export async function getVariantsByProduct(productId) {
  const response = await getAllVariants()

  if (!response.success || !Array.isArray(response.data)) {
    return response
  }

  return {
    ...response,
    data: response.data.filter((variant) => {
      const currentProductId = variant.productId ?? variant.product?.id ?? variant.product_id
      return String(currentProductId) === String(productId)
    }),
  }
}

export function getVariantById(id) {
  return apiRequest(`/productvariants/${id}`)
}

export function createVariant(productId, data) {
  return apiRequest(`/productvariants/${productId}`, {
    method: 'POST',
    body: data,
  })
}

export function updateVariant(id, data) {
  return apiRequest(`/productvariants/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteVariant(id) {
  return apiRequest(`/productvariants/${id}`, {
    method: 'DELETE',
  })
}
