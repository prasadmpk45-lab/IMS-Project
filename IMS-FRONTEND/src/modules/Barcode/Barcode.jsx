import { Plus, ScanLine } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getRequiredError, getToday } from '../../utils/helpers'
import BarcodeForm from './components/BarcodeForm'
import BarcodeTable from './components/BarcodeTable'
import { getPreviewValue } from './utils/preview'
import './Barcode.css'

const initialForm = {
  productId: '',
  codeType: 'Barcode',
  date: getToday(),
}

export default function Barcode({
  barcodes,
  products,
  onSaveBarcode,
  onQuickAddProduct,
}) {
  const { hasPermission } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [message, setMessage] = useState(null)
  const canCreate = hasPermission('barcode', 'create')

  const errors = {
    productId: getRequiredError(formData.productId, 'Product'),
    date: getRequiredError(formData.date, 'Date'),
  }
  const selectedProduct = products.find((item) => item.id === formData.productId) ?? null
  const livePreviewValue = getPreviewValue(selectedProduct, formData.codeType)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((currentValue) => ({ ...currentValue, [name]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({ productId: true, date: true })

    if (Object.values(errors).some(Boolean)) {
      return
    }

    const result = onSaveBarcode(formData)
    setMessage(result)

    if (result.success) {
      setFormData(initialForm)
      setTouched({})
      setIsFormOpen(false)
    }
  }

  function handleQuickAddProduct(values) {
    const result = onQuickAddProduct(values)
    setMessage(result)
    return result.success ? result.item : null
  }

  function handleCancel() {
    setFormData(initialForm)
    setTouched({})
    setIsFormOpen(false)
  }

  return (
    <div className="page barcode-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <ScanLine size={20} />
          </div>
          <div>
            <h1>Barcode / QR</h1>
            <p className="page-subtitle">
              Generate static barcode and QR visuals with a future-ready structure.
            </p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => setIsFormOpen((currentValue) => !currentValue)}
            >
              <Plus size={16} />
              Add Code
            </button>
          </div>
        ) : null}
      </div>

      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}

      {isFormOpen ? (
        <BarcodeForm
          formData={formData}
          touched={touched}
          errors={errors}
          products={products}
          livePreviewValue={livePreviewValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onQuickAddProduct={handleQuickAddProduct}
        />
      ) : null}

      <BarcodeTable barcodes={barcodes} />
    </div>
  )
}
