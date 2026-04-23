import { Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import FormModal from '../../layouts/FormModal'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'
import './Products.css'

export default function Products({
  products,
  suppliers,
  warehouses,
  onSaveProduct,
  onDeleteProduct,
}) {
  const { hasPermission } = useAuth()

  const [editingProduct, setEditingProduct] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)

  // 🔥 NEW (for dynamic add)
  const [localSuppliers, setLocalSuppliers] = useState(suppliers)
  const [localWarehouses, setLocalWarehouses] = useState(warehouses)

  const canCreate = hasPermission('products', 'create')
  const canEdit = hasPermission('products', 'edit')
  const canDelete = hasPermission('products', 'delete')

  const showForm = isFormOpen || Boolean(editingProduct)

  function handleOpenCreate() {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    const result = onSaveProduct(values, editingProduct?.id ?? null)
    setMessage(result)

    if (result.success) {
      handleCloseForm()
    }
  }

  function handleDelete(productId) {
    onDeleteProduct(productId)

    setMessage({
      success: true,
      message: 'Product deleted successfully.',
    })

    if (editingProduct?.id === productId) {
      handleCloseForm()
    }
  }

  return (
    <div className="page products-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Package size={20} />
          </div>
          <div>
            <h1>Products</h1>
            <p className="page-subtitle">
              Manage product master records and opening stock quantities.
            </p>
          </div>
        </div>

        {canCreate && (
          <div className="page-header__actions">
            <button
              type="button"
              className="button button-primary"
              onClick={handleOpenCreate}
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      )}

      <div className="content-grid content-grid--single">
        <ProductTable
          products={products}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <FormModal onClose={handleCloseForm}>
          <ProductForm
            key={editingProduct?.id ?? 'new-product'}

            // 🔥 IMPORTANT (updated)
            suppliers={localSuppliers}
            setSuppliers={setLocalSuppliers}

            warehouses={localWarehouses}
            setWarehouses={setLocalWarehouses}

            initialValues={editingProduct}
            canSubmit={editingProduct ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </FormModal>
      )}
    </div>
  )
}