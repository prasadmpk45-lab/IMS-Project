import { apiRequest } from './apiClient'

export function getProducts() {
  return apiRequest('/products')
}

export function createFullProduct(data) {
  return apiRequest('/products/full', {
    method: 'POST',
    body: data,
  })
}

export function updateProduct(id, data) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  })
}

export function getCategories() {
  return apiRequest('/categories')
}

export function createCategory(data) {
  return apiRequest('/categories', {
    method: 'POST',
    body: data,
  })
}

export function getBrands() {
  return apiRequest('/brands')
}

export function createBrand(data) {
  return apiRequest('/brands', {
    method: 'POST',
    body: data,
  })
}

export function getUnits() {
  return apiRequest('/units')
}

export function createUnit(data) {
  return apiRequest('/units', {
    method: 'POST',
    body: data,
  })
}
