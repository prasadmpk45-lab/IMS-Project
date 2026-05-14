import { apiRequest } from './apiClient'

export function getAllSuppliers() {
  return apiRequest('/Suppliers')
}

export function getSupplierById(id) {
  return apiRequest(`/Suppliers/${id}`)
}

export function createSupplier(data) {
  return apiRequest('/Suppliers', {
    method: 'POST',
    body: data,
  })
}

export function updateSupplier(id, data) {
  return apiRequest(`/Suppliers/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteSupplier(id) {
  return apiRequest(`/Suppliers/${id}`, {
    method: 'DELETE',
  })
}
