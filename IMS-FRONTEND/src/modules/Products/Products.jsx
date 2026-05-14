import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import { showToast } from '../../components/common/toast'
import {
  createFullProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../api/productApi'
import {
  createVariant,
  deleteVariant,
  getVariantsByProduct,
  updateVariant,
} from '../../api/productVariantsApi'
import ProductsHeader from './components/ProductsHeader'
import ProductsTable from './components/ProductsTable'
import ProductForm from './components/ProductForm'

function getPayloadData(response) {
  const data = response?.data
  return data?.data ?? data?.items ?? data ?? null
}

function getEntityId(entity) {
  return entity?.id ?? entity?._id ?? entity?.productId ?? ''
}

function toNumber(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function prepareProductPayload(values) {
  let variants = Array.isArray(values?.variants) ? values.variants : []

  // ✅ FIX: ensure at least one variant
  if (variants.length === 0) {
    variants = [
      {
        variantName: 'Default',
        sku: values.sku || '',
        priceDelta: 0,
        stockDelta: 0,
        attributes: [],
      },
    ]
  }

  return {
    name: values.name || '',
    sku: values.sku || '',
    barcode: values.barcode || '',

    // ✅ FIX: avoid 0 IDs
    categoryId: Number(values.categoryId) || null,
    brandId: Number(values.brandId) || null,
    unitId: Number(values.unitId) || null,

    price: Number(values.price),
    costPrice: Number(values.costPrice),
    stock: Number(values.stock),
    reorderLevel: Number(values.reorderLevel),

    supplierId: Number(values.supplierId) || null,
    warehouseId: Number(values.warehouseId) || null,

    status: values.status || '',
    description: values.description || '',

    variants: variants.map((variant, index) => ({
      variantName: variant.variantName || `Variant-${index + 1}`,
      sku: variant.sku || values.sku || '',
      priceDelta: Number(variant.priceDelta || 0),
      stockDelta: Number(variant.stockDelta || 0),

      attributes: (Array.isArray(variant.attributes) ? variant.attributes : []).map((attribute) => ({
        attributeId: Number(attribute.attributeId),
        valueId: Number(attribute.valueId),
      })),
    })),
  }
}

export default function Products({
  suppliers = [],
  warehouses = [],
  onQuickAddSupplier,
  onQuickAddWarehouse,
}) {
  const { hasPermission } = useAuth()

  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [filters] = useState({
    category: '',
    brand: '',
    unit: '',
  })

  const canCreate = hasPermission('products', 'create')
  const canEdit = hasPermission('products', 'edit')
  const canDelete = hasPermission('products', 'delete')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getProducts()
      const data = getPayloadData(response)

      if (!response.success) {
        throw new Error(response.error || 'Failed to load products')
      }

      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products'
      setErrorMessage(message)
      showToast({ type: 'error', title: 'Products', message })
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  function getVariantList(response) {
    const data = getPayloadData(response)
    return Array.isArray(data) ? data : []
  }

  async function runVariantRequest(request) {
    const response = await request()

    if (!response.success) {
      throw new Error(response.error || 'Variant request failed')
    }

    return getPayloadData(response)
  }

  async function loadProductVariants(productId) {
    const response = await getVariantsByProduct(productId)

    if (!response.success) {
      throw new Error(response.error || 'Failed to load product variants')
    }

    return getVariantList(response)
  }

  async function syncProductVariants(productId, variantDrafts) {
    const drafts = Array.isArray(variantDrafts) ? variantDrafts : []
    const existingList = await loadProductVariants(productId)
    const existingIds = new Set(existingList.map((item) => String(getEntityId(item))))
    const draftIds = new Set(drafts.map((item) => String(item.id)))

    for (const existing of existingList) {
      const existingId = String(getEntityId(existing))
      if (!draftIds.has(existingId)) {
        await runVariantRequest(() => deleteVariant(existingId))
      }
    }

    for (const draft of drafts) {
      const payload = {
        variantName: draft.variantName || '',
        sku: draft.sku || '',
        priceDelta: toNumber(draft.priceDelta),
        stockDelta: toNumber(draft.stockDelta),
        attributes: (Array.isArray(draft.attributes) ? draft.attributes : [])
          .filter((attribute) => attribute.attributeId || attribute.valueId)
          .map((attribute) => ({
            attributeId: toNumber(attribute.attributeId),
            valueId: toNumber(attribute.valueId),
          })),
      }

      if (existingIds.has(String(draft.id))) {
        await runVariantRequest(() => updateVariant(String(draft.id), payload))
      } else {
        await runVariantRequest(() => createVariant(productId, payload))
      }
    }
  }

  async function saveProduct(values, id = null) {
    const payload = prepareProductPayload(values)

    console.log('FINAL PAYLOAD:', payload)

    if (id) {
      const response = await updateProduct(id, payload)

      if (!response.success) {
        throw new Error(response.error || 'Save failed')
      }

      await syncProductVariants(id, values.variants)
      return getPayloadData(response)
    }

    const response = await createFullProduct(payload)

    if (!response.success) {
      throw new Error(response.error || 'Save failed')
    }

    return getPayloadData(response)
  }

  async function handleSave(values, id = null) {
    try {
      await saveProduct(values, id)
      showToast({ type: 'success', title: 'Products', message: 'Saved successfully' })
      await fetchProducts()
      setIsFormOpen(false)
    } catch {
      showToast({ type: 'error', title: 'Products', message: 'Save failed' })
    }
  }

  async function handleDelete(id) {
    try {
      const response = await deleteProduct(id)

      if (!response.success) {
        throw new Error(response.error || 'Delete failed')
      }

      showToast({ type: 'success', title: 'Products', message: 'Deleted successfully' })
      await fetchProducts()
    } catch {
      showToast({ type: 'error', title: 'Products', message: 'Delete failed' })
    }
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  function handleOpenCreate() {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false
      if (filters.brand && p.brand !== filters.brand) return false
      if (filters.unit && p.unit !== filters.unit) return false
      return true
    })
  }, [products, filters])

  return (
    <div className="page products-page">
      <ProductsHeader canCreate={canCreate} onAdd={handleOpenCreate} />

      {errorMessage ? (
        <div className="message-box message-box--error">{errorMessage}</div>
      ) : null}

      <ProductsTable
        products={filteredProducts}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage={isLoading ? 'Loading products...' : 'No products available.'}
      />

      {isFormOpen && (
        <FormModal
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          onClose={handleCloseForm}
        >
          <ProductForm
            initialValues={editingProduct}
            suppliers={suppliers}
            warehouses={warehouses}
            canSubmit={editingProduct ? canEdit : canCreate}
            onQuickAddSupplier={onQuickAddSupplier}
            onQuickAddWarehouse={onQuickAddWarehouse}
            onSubmit={(data) => handleSave(data, editingProduct?.id)}
            onCancel={handleCloseForm}
          />
        </FormModal>
      )}
    </div>
  )
}

