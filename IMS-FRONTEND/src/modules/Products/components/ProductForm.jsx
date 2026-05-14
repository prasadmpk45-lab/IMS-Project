import {
  AlertTriangle,
  Barcode,
  Boxes,
  CheckCircle,
  Pencil,
  FileText,
  Hash,
  ImageUp,
  Package,
  Palette,
  Plus,
  RotateCcw,
  Ruler,
  Save,
  Star,
  Tag,
  Trash2,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import DropdownWithAdd from '../../../components/DropdownWithAdd'
import DatePicker from '../../../components/DatePicker'
import InputField from '../../../components/InputField'
import SearchableSelect from '../../../components/SearchableSelect'
import { createBrand, createCategory, createUnit, getBrands, getCategories, getUnits } from '../../../api/productApi'
import { getVariantsByProduct } from '../../../api/productVariantsApi'
import { createId, getNumberError, getRequiredError, getToday } from '../../../utils/helpers'
import './ProductForm.css'

const defaultCategories = []
const defaultBrands = []
const defaultUnits = []

function getPayloadData(response) {
  const data = response?.data
  return data?.data ?? data?.items ?? data ?? null
}

const statusOptions = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
]

const emptyForm = {
  productId: '',
  name: '',
  sku: '',
  barcode: '',
  description: '',
  categoryId: '',
  brandId: '',
  unitId: '',
  status: 'active',
  costPrice: '',
  price: '',
  stock: '',
  reorderLevel: '',
  supplierId: '',
  warehouseId: '',
  createdAt: getToday(),
  updatedAt: '',
  variantSize: '',
  variantColor: '',
  image: '',
  variants: [
  {
    id: '',
    variantName: '',
    sku: '',
    priceDelta: '',
    stockDelta: '',
    attributes: [],
  },
],
}

function formatIndianCurrency(value) {
  const numberValue = Number(String(value).replace(/[^0-9.]/g, ''))

  if (!Number.isFinite(numberValue)) {
    return ''
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numberValue)
}

function parseCurrencyInput(value) {
  const cleaned = String(value).replace(/[^0-9.]/g, '')

  if (cleaned === '') {
    return ''
  }

  const parts = cleaned.split('.')
  return parts.length <= 1 ? parts[0] : `${parts[0]}.${parts[1].slice(0, 2)}`
}

function isCurrencyField(name) {
  return name === 'costPrice' || name === 'price'
}

function normalizeVariant(variant = {}) {
  return {
    id: variant.id ?? '',
    variantName: variant.variantName ?? variant.name ?? '',
    sku: variant.sku ?? '',
    priceDelta: variant.priceDelta ?? '',
    stockDelta: variant.stockDelta ?? '',
    attributeId: variant.attributeId ?? variant.attributes?.[0]?.attributeId ?? '',
    valueId: variant.valueId ?? variant.value ?? variant.attributes?.[0]?.valueId ?? '',
    attributes: Array.isArray(variant.attributes)
      ? variant.attributes.map((attribute) => ({
          attributeId: attribute.attributeId ?? '',
          valueId: attribute.valueId ?? '',
        }))
      : [],
  }
}

function normalizeFormValues(values) {
  const normalized = Object.entries(values).reduce((nextValues, [key, value]) => ({
    ...nextValues,
    [key]: value ?? '',
  }), {})

  return {
    ...normalized,
    variants: Array.isArray(values.variants) ? values.variants.map(normalizeVariant) : [],
  }
}

function getInitialForm(initialValues) {
  if (!initialValues) {
    return normalizeFormValues({
      ...emptyForm,
      productId: createId('PRD'),
    })
  }

  return normalizeFormValues({
    ...emptyForm,
    ...initialValues,
    categoryId: initialValues.categoryId ?? initialValues.category ?? '',
    brandId: initialValues.brandId ?? initialValues.brand ?? '',
    unitId: initialValues.unitId ?? initialValues.unit ?? '',
    costPrice: initialValues.costPrice ?? initialValues.cost ?? '',
    variants: Array.isArray(initialValues.variants)
      ? initialValues.variants
      : Array.isArray(initialValues.variantDrafts)
        ? initialValues.variantDrafts
        : [],
    productId: initialValues.productId ?? createId('PRD'),
    status:
      initialValues.status === 'Inactive' || initialValues.status === 'inactive'
        ? 'inactive'
        : 'active',
  })
}

function createAddOption(setOptions) {
  return (draft) => {
    const label = String(draft.name ?? '').trim()

    if (!label) {
      return null
    }

    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const nextOption = { id, label }

    setOptions((currentValue) => {
      if (currentValue.some((option) => option.label.toLowerCase() === label.toLowerCase())) {
        return currentValue
      }

      return [nextOption, ...currentValue]
    })

    return nextOption
  }
}

function toOption(item) {
  const id = item?.id ?? item?._id ?? item?.value ?? item?.name
  const label = item?.label ?? item?.name ?? String(id ?? '')
  return { id: String(id), label: String(label) }
}

export default function ProductForm({
  suppliers = [],
  warehouses = [],
  initialValues,
  canSubmit,
  onQuickAddSupplier,
  onQuickAddWarehouse,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [imagePreview, setImagePreview] = useState(() => initialValues?.image ?? '')
  const [categories, setCategories] = useState(defaultCategories)
  const [brands, setBrands] = useState(defaultBrands)
  const [units, setUnits] = useState(defaultUnits)
  const [attributes, setAttributes] = useState([])
  const [variantDraft, setVariantDraft] = useState({
    id: '',
    variantName: '',
    sku: '',
    priceDelta: '',
    stockDelta: '',
    attributeId: '',
    valueId: '',
    attributes: [],
  })

  useEffect(() => {
    let mounted = true

    async function loadReferenceData() {
      try {
        const [categoriesData, brandsData, unitsData] = await Promise.all([
          getCategories(),
          getBrands(),
          getUnits(),
        ])

        if (!mounted) {
          return
        }

        const categoryList = getPayloadData(categoriesData)
        const brandList = getPayloadData(brandsData)
        const unitList = getPayloadData(unitsData)

        setCategories(Array.isArray(categoryList) ? categoryList.map(toOption) : [])
        setBrands(Array.isArray(brandList) ? brandList.map(toOption) : [])
        setUnits(Array.isArray(unitList) ? unitList.map(toOption) : [])
        setAttributes([])
      } catch {
        if (!mounted) {
          return
        }

        setCategories(defaultCategories)
        setBrands(defaultBrands)
        setUnits(defaultUnits)
        setAttributes([])
      }
    }

    loadReferenceData()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadVariantDrafts() {
      if (!initialValues?.id) {
        return
      }

      try {
        const variantsResponse = await getVariantsByProduct(initialValues.id)
        const variants = getPayloadData(variantsResponse)

        if (!variantsResponse.success) {
          throw new Error(variantsResponse.error || 'Failed to load variants')
        }

        const normalized = Array.isArray(variants) ? variants : []
        const drafts = await Promise.all(
          normalized.map(async (variant) => {
            const variantId = variant.id ?? variant._id
            let attributeId = ''
            let valueId = ''

            attributeId = String(variant.attributeId ?? variant.attribute?.id ?? '')
            valueId = String(variant.valueId ?? variant.value ?? '')

            return normalizeVariant({
              id: String(variantId ?? ''),
              variantName: String(variant.variantName ?? variant.name ?? ''),
              sku: String(variant.sku ?? ''),
              priceDelta: String(variant.priceDelta ?? 0),
              stockDelta: String(variant.stockDelta ?? 0),
              attributeId,
              valueId,
              attributes: attributeId || valueId ? [{ attributeId, valueId }] : [],
            })
          }),
        )

        if (!mounted) {
          return
        }

        setFormData((current) => ({
          ...current,
          variants: drafts,
        }))
      } catch {
        if (!mounted) {
          return
        }
      }
    }

    loadVariantDrafts()

    return () => {
      mounted = false
    }
  }, [initialValues?.id])

  async function handleAddCategory(draft) {
    const label = String(draft?.name ?? '').trim()
    if (!label) {
      return null
    }

    try {
      const response = await createCategory({ name: label })
      if (!response.success) throw new Error(response.error || 'Failed to create category')
      const nextOption = toOption(getPayloadData(response))
      setCategories((current) => [nextOption, ...current])
      return nextOption
    } catch {
      return createAddOption(setCategories)(draft)
    }
  }

  async function handleAddBrand(draft) {
    const label = String(draft?.name ?? '').trim()
    if (!label) {
      return null
    }

    try {
      const response = await createBrand({ name: label })
      if (!response.success) throw new Error(response.error || 'Failed to create brand')
      const nextOption = toOption(getPayloadData(response))
      setBrands((current) => [nextOption, ...current])
      return nextOption
    } catch {
      return createAddOption(setBrands)(draft)
    }
  }

  async function handleAddUnit(draft) {
    const label = String(draft?.name ?? '').trim()
    if (!label) {
      return null
    }

    try {
      const response = await createUnit({ name: label })
      if (!response.success) throw new Error(response.error || 'Failed to create unit')
      const nextOption = toOption(getPayloadData(response))
      setUnits((current) => [nextOption, ...current])
      return nextOption
    } catch {
      return createAddOption(setUnits)(draft)
    }
  }

  function getSkuError(value) {
  if (!String(value ?? '').trim()) {
    return ''
  }

  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return 'SKU must only contain letters, numbers, dashes, or underscores.'
  }

  return ''
}

const errors = {
    name: getRequiredError(formData.name, 'Product name'),
    sku:
      getRequiredError(formData.sku, 'SKU') || getSkuError(formData.sku),
    barcode: getRequiredError(formData.barcode, 'Barcode'),
    categoryId: getRequiredError(formData.categoryId, 'Category'),
    brandId: getRequiredError(formData.brandId, 'Brand'),
    unitId: getRequiredError(formData.unitId, 'Unit'),
    status: getRequiredError(formData.status, 'Status'),
    supplierId: getRequiredError(formData.supplierId, 'Supplier'),
    warehouseId: getRequiredError(formData.warehouseId, 'Warehouse'),
    costPrice: getNumberError(formData.costPrice, 'Cost', { min: 0, allowZero: true }),
    price: getNumberError(formData.price, 'Price', { allowZero: false }),
    stock: getNumberError(formData.stock, 'Stock', { min: 0 }),
    reorderLevel: getNumberError(formData.reorderLevel, 'Reorder level', { min: 0 }),
    createdAt: getRequiredError(formData.createdAt, 'Created date'),
  }

  const isFormValid = Object.values(errors).every((value) => !value)

  function handleChange(event) {
    const { name, value } = event.target
    const nextValue = isCurrencyField(name) ? parseCurrencyInput(value) : value

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: nextValue,
    }))
  }

  function handleBlur(event) {
    setTouched((currentValue) => ({
      ...currentValue,
      [event.target.name]: true,
    }))
  }

  function handleImageChange(event) {
    const [file] = event.target.files ?? []

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const nextImage = String(reader.result ?? '')
      setImagePreview(nextImage)
      setFormData((currentValue) => ({
        ...currentValue,
        image: nextImage,
      }))
    }

    reader.readAsDataURL(file)
  }

  function handleVariantDraftChange(event) {
    const { name, value } = event.target
    setVariantDraft((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleAddVariantDraft() {
    if (!variantDraft.variantName.trim()) {
      return
    }

    const nextDraft = {
      ...variantDraft,
      id: variantDraft.id || createId('VRN'),
      variantName: variantDraft.variantName.trim(),
      sku: variantDraft.sku.trim(),
      priceDelta: variantDraft.priceDelta || '0',
      stockDelta: variantDraft.stockDelta || '0',
      valueId: variantDraft.valueId.trim(),
      attributes: variantDraft.attributeId || variantDraft.valueId
        ? [{ attributeId: variantDraft.attributeId, valueId: variantDraft.valueId }]
        : [],
    }

    setFormData((current) => {
      const existingIndex = current.variants.findIndex((item) => item.id === nextDraft.id)
      if (existingIndex >= 0) {
        const nextDrafts = [...current.variants]
        nextDrafts[existingIndex] = nextDraft
        return { ...current, variants: nextDrafts }
      }

      return {
        ...current,
        variants: [...current.variants, nextDraft],
      }
    })

    setVariantDraft({
      id: '',
      variantName: '',
      sku: '',
      priceDelta: '',
      stockDelta: '',
      attributeId: '',
      valueId: '',
      attributes: [],
    })
  }

  function handleEditVariantDraft(item) {
    setVariantDraft(item)
  }

  function handleDeleteVariantDraft(id) {
    setFormData((current) => ({
      ...current,
      variants: current.variants.filter((item) => item.id !== id),
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      name: true,
      sku: true,
      barcode: true,
      categoryId: true,
      brandId: true,
      unitId: true,
      status: true,
      supplierId: true,
      warehouseId: true,
      costPrice: true,
      price: true,
      stock: true,
      reorderLevel: true,
      createdAt: true,
    })

    if (!isFormValid) {
      return
    }

    setSuccessMessage('Product saved successfully.')
    onSubmit?.(formData)
  }

  function handleCancel() {
    if (initialValues) {
      onCancel()
      return
    }

    setFormData(getInitialForm())
    setTouched({})
    setSuccessMessage('')
    setImagePreview('')
  }

  return (
    <div className="product-form">
      {successMessage ? (
        <div className="form-alert">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      ) : null}

      <form className="form-grid" onSubmit={handleSubmit} autoComplete="off">
        <InputField
          id="name"
          name="name"
          label="Product Name"
          icon={Package}
          value={formData.name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter product name"
          error={touched.name ? errors.name : ''}
        />

        <InputField
          id="sku"
          name="sku"
          label="SKU"
          icon={Hash}
          value={formData.sku || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter SKU"
          error={touched.sku ? errors.sku : ''}
        />

        <InputField
          id="barcode"
          name="barcode"
          label="Barcode"
          icon={Barcode}
          value={formData.barcode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter barcode value"
          error={touched.barcode ? errors.barcode : ''}
        />

        <DropdownWithAdd
          id="category"
          name="categoryId"
          label="Category"
          icon={Tag}
          value={formData.categoryId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={categories}
          placeholder="Select category"
          error={errors.categoryId}
          showError={touched.categoryId}
          onAddOption={handleAddCategory}
          addLabel="+ Add"
          addTitle="Add Category"
          addFields={[
            {
              name: 'name',
              label: 'Category Name',
              placeholder: 'Enter category name',
            },
          ]}
        />

        <DropdownWithAdd
          id="brand"
          name="brandId"
          label="Brand"
          icon={Star}
          value={formData.brandId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={brands}
          placeholder="Select brand"
          error={errors.brandId}
          showError={touched.brandId}
          onAddOption={handleAddBrand}
          addLabel="+ Add"
          addTitle="Add Brand"
          addFields={[
            {
              name: 'name',
              label: 'Brand Name',
              placeholder: 'Enter brand name',
            },
          ]}
        />

        <DropdownWithAdd
          id="unit"
          name="unitId"
          label="Unit"
          icon={Ruler}
          value={formData.unitId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={units}
          placeholder="Select unit"
          error={errors.unitId}
          showError={touched.unitId}
          onAddOption={handleAddUnit}
          addLabel="+ Add"
          addTitle="Add Unit"
          addFields={[
            {
              name: 'name',
              label: 'Unit Name',
              placeholder: 'Enter unit name',
            },
          ]}
        />

        <InputField
          id="variantSize"
          name="variantSize"
          label="Variant Size"
          icon={Ruler}
          value={formData.variantSize || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Example: XL, 5mm, 32GB"
        />

        <InputField
          id="variantColor"
          name="variantColor"
          label="Variant Color"
          icon={Palette}
          value={formData.variantColor || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Example: Black, Blue, Natural"
        />

        <div className="field full-width">
          <label>Product Variants</label>
          <div className="form-grid">
            <InputField
              id="variant-name"
              name="variantName"
              label="Variant Name"
              value={variantDraft.variantName || ''}
              onChange={handleVariantDraftChange}
              placeholder="Example: Size M / Black"
            />
            <InputField
              id="variant-sku"
              name="sku"
              label="Variant SKU"
              value={variantDraft.sku || ''}
              onChange={handleVariantDraftChange}
              placeholder="Variant SKU"
            />
            <InputField
              id="variant-price-delta"
              name="priceDelta"
              type="number"
              label="Price Delta"
              value={variantDraft.priceDelta || ''}
              onChange={handleVariantDraftChange}
              placeholder="0"
            />
            <InputField
              id="variant-stock-delta"
              name="stockDelta"
              type="number"
              label="Stock Delta"
              value={variantDraft.stockDelta || ''}
              onChange={handleVariantDraftChange}
              placeholder="0"
            />
            <SearchableSelect
              id="variant-attribute-id"
              name="attributeId"
              label="Attribute"
              value={variantDraft.attributeId || ''}
              onChange={handleVariantDraftChange}
              onBlur={handleBlur}
              options={attributes}
              placeholder="Select attribute"
            />
            <InputField
              id="variant-attribute-value"
              name="valueId"
              label="Attribute Value ID"
              value={variantDraft.valueId || ''}
              onChange={handleVariantDraftChange}
              placeholder="Example: 1"
            />
          </div>

          <div className="button-row">
            <button type="button" className="button" onClick={handleAddVariantDraft}>
              <Plus size={16} />
              {variantDraft.id ? 'Update Variant' : 'Add Variant'}
            </button>
          </div>

          {formData.variants.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.variants.map((item, index) => (
                    <tr key={item.id || `${item.variantName}-${item.sku}-${index}`}>
                      <td>{item.variantName}</td>
                      <td>{item.sku || '-'}</td>
                      <td>{attributes.find((attr) => attr.id === item.attributeId)?.label || '-'}</td>
                      <td>{item.valueId || '-'}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="icon-btn" onClick={() => handleEditVariantDraft(item)}>
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="icon-btn text-red-600" onClick={() => handleDeleteVariantDraft(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <SearchableSelect
          id="status"
          name="status"
          label="Status"
          icon={CheckCircle}
          value={formData.status || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={statusOptions}
          placeholder="Select status"
          error={errors.status}
          showError={touched.status}
        />

        <InputField
          id="costPrice"
          name="costPrice"
          type="text"
          inputMode="decimal"
          label="Cost"
          prefix="₹"
          value={formData.costPrice ? formatIndianCurrency(formData.costPrice) : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter cost (₹)"
          error={touched.costPrice ? errors.costPrice : ''}
        />

        <InputField
          id="price"
          name="price"
          type="text"
          inputMode="decimal"
          label="Price"
          prefix="₹"
          value={formData.price ? formatIndianCurrency(formData.price) : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter price (₹)"
          error={touched.price ? errors.price : ''}
        />

        <InputField
          id="stock"
          name="stock"
          type="number"
          label="Stock"
          icon={Boxes}
          value={formData.stock || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter available quantity"
          error={touched.stock ? errors.stock : ''}
        />

        <InputField
          id="reorderLevel"
          name="reorderLevel"
          type="number"
          label="Reorder Level"
          icon={AlertTriangle}
          value={formData.reorderLevel || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Minimum reorder level"
          error={touched.reorderLevel ? errors.reorderLevel : ''}
        />

        <DropdownWithAdd
          id="supplierId"
          name="supplierId"
          label="Supplier"
          icon={Truck}
          value={formData.supplierId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={suppliers}
          placeholder="Select supplier"
          error={errors.supplierId}
          showError={touched.supplierId}
          onAddOption={onQuickAddSupplier}
          addLabel="+ Add"
          addTitle="Add Supplier"
          addFields={[
            {
              name: 'name',
              label: 'Supplier Name',
              placeholder: 'Enter supplier name',
            },
          ]}
        />

        <DropdownWithAdd
          id="warehouseId"
          name="warehouseId"
          label="Warehouse"
          icon={Warehouse}
          value={formData.warehouseId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          options={warehouses}
          placeholder="Select warehouse"
          error={errors.warehouseId}
          showError={touched.warehouseId}
          onAddOption={onQuickAddWarehouse}
          addLabel="+ Add"
          addTitle="Add Warehouse"
          addFields={[
            {
              name: 'name',
              label: 'Warehouse Name',
              placeholder: 'Enter warehouse name',
            },
          ]}
        />

        <InputField
          id="description"
          name="description"
          label="Description"
          icon={FileText}
          textarea
          rows={4}
          className="field--full"
          value={formData.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Add a short product description"
        />

        <div className="field field--full">
          <label htmlFor="image-upload">Product Image</label>
          <div className="product-form__image-picker">
            <label className="product-form__upload-button" htmlFor="image-upload">
              <ImageUp size={16} />
              Upload preview
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="product-form__image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" />
              ) : (
                <div className="product-form__image-empty">No image selected</div>
              )}
            </div>
          </div>
        </div>

        <DatePicker
          id="createdAt"
          name="createdAt"
          label="Created At"
          value={formData.createdAt || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.createdAt ? errors.createdAt : ''}
        />

        <DatePicker
          id="updatedAt"
          name="updatedAt"
          label="Updated At"
          value={formData.updatedAt || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="DD/MM/YYYY"
        />

        <div className="button-row field--full">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || !isFormValid}
          >
            <Save size={16} />
            Save Product
          </button>
          <button type="button" className="button" onClick={handleCancel}>
            <RotateCcw size={16} />
            {initialValues ? 'Cancel' : 'Clear'}
          </button>
        </div>
      </form>
    </div>
  )
}


