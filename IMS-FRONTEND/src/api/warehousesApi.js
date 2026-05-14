import { apiRequest } from './apiClient'

export function getAllWarehouses() {
  return apiRequest('/Warehouses')
}

export function getWarehouseById(id) {
  return apiRequest(`/Warehouses/${id}`)
}

export function createWarehouse(data) {
  return apiRequest('/Warehouses', {
    method: 'POST',
    body: data,
  })
}

export function updateWarehouse(id, data) {
  return apiRequest(`/Warehouses/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteWarehouse(id) {
  return apiRequest(`/Warehouses/${id}`, {
    method: 'DELETE',
  })
}
