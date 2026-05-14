const BASE_URL = "https://trimestral-flusteredly-patrice.ngrok-free.dev/api";
 
// 🔹 helper headers
function commonHeaders() {
 return {
 "ngrok-skip-browser-warning": "true",
 };
}
 
function authHeaders() {
 return {
 "Content-Type": "application/json",
 Authorization: `Bearer ${localStorage.getItem("token")}`,
 "ngrok-skip-browser-warning": "true",
 };
}
 
export const catalogApi = {
 
 // ✅ GET PRODUCTS (FIXED)
 async getProducts() {
 const res = await fetch(`${BASE_URL}/products`, {
 headers: commonHeaders(),
 });
 
 if (!res.ok) throw new Error("Failed to load products");
 return await res.json();
 },
 
 // ✅ GET CATEGORIES
 async getCategories() {
 const res = await fetch(`${BASE_URL}/categories`, {
 headers: commonHeaders(),
 });
 
 return await res.json();
 },
 
 // ✅ GET BRANDS
 async getBrands() {
 const res = await fetch(`${BASE_URL}/brands`, {
 headers: commonHeaders(),
 });
 
 return await res.json();
 },
 
 // ✅ GET UNITS
 async getUnits() {
 const res = await fetch(`${BASE_URL}/units`, {
 headers: commonHeaders(),
 });
 
 return await res.json();
 },
 
 // ✅ CREATE PRODUCT
 async createProduct(data) {
 const res = await fetch(`${BASE_URL}/products`, {
 method: "POST",
 headers: authHeaders(),
 body: JSON.stringify(data),
 });
 
 return await res.json();
 },
 
 // ✅ UPDATE PRODUCT
 async updateProduct(id, data) {
 const res = await fetch(`${BASE_URL}/products/${id}`, {
 method: "PUT",
 headers: authHeaders(),
 body: JSON.stringify(data),
 });
 
 return await res.json();
 },
 
 // ✅ DELETE PRODUCT
 async deleteProduct(id) {
 const res = await fetch(`${BASE_URL}/products/${id}`, {
 method: "DELETE",
 headers: authHeaders(),
 });
 
 return await res.json();
 },
};
 