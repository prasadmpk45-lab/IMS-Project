import { CreditCard, Mail, MapPin, Phone, RotateCcw, Save, Tag, Truck, User } from 'lucide-react'
import { useState } from 'react'
import InputField from '../../../components/InputField'
import {
  getEmailError,
  getNameError,
  getNumberError,
  getRequiredError,
} from '../../../utils/helpers'

const emptyForm = {
  name: '',
  contact: '',
  secondaryContact: '',
  email: '',
  phone: '',
  category: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  paymentTerms: 'Net 30',
  creditDays: '30',
}

const tabs = [
  { id: 'contacts', label: 'Contacts' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'payments', label: 'Payment Terms' },
]

function getInitialForm(initialValues) {
  return initialValues ? { ...emptyForm, ...initialValues } : emptyForm
}

export default function SupplierForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})
  const [activeTab, setActiveTab] = useState('contacts')

  const errors = {
    name: getNameError(formData.name, 'Supplier name'),
    contact: getNameError(formData.contact, 'Contact person'),
    email: getEmailError(formData.email),
    phone: getRequiredError(formData.phone, 'Phone'),
    category: getRequiredError(formData.category, 'Category'),
    creditDays: getNumberError(formData.creditDays, 'Credit days', { min: 0 }),
  }

  const isValid = Object.values(errors).every((value) => !value)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleBlur(event) {
    setTouched((currentValue) => ({
      ...currentValue,
      [event.target.name]: true,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setTouched({
      name: true,
      contact: true,
      email: true,
      phone: true,
      category: true,
      creditDays: true,
    })

    if (!isValid) {
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="supplier-form">
      <div className="supplier-form__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`supplier-form__tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-grid supplier-form__grid">
        {activeTab === 'contacts' ? (
          <>
            <InputField
              id="supplier-name"
              name="name"
              label="Supplier Name"
              icon={Truck}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : ''}
            />
            <InputField
              id="supplier-contact"
              name="contact"
              label="Primary Contact"
              icon={User}
              value={formData.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contact ? errors.contact : ''}
            />
            <InputField
              id="supplier-secondary-contact"
              name="secondaryContact"
              label="Secondary Contact"
              icon={User}
              value={formData.secondaryContact}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              id="supplier-email"
              name="email"
              label="Email"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
            />
            <InputField
              id="supplier-phone"
              name="phone"
              label="Phone"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone ? errors.phone : ''}
            />
            <InputField
              id="supplier-category"
              name="category"
              label="Category"
              icon={Tag}
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category ? errors.category : ''}
            />
          </>
        ) : null}

        {activeTab === 'addresses' ? (
          <>
            <InputField
              id="supplier-address-line-1"
              name="addressLine1"
              label="Address Line 1"
              icon={MapPin}
              value={formData.addressLine1}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              id="supplier-address-line-2"
              name="addressLine2"
              label="Address Line 2"
              icon={MapPin}
              value={formData.addressLine2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              id="supplier-city"
              name="city"
              label="City"
              icon={MapPin}
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              id="supplier-state"
              name="state"
              label="State"
              icon={MapPin}
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              id="supplier-postal-code"
              name="postalCode"
              label="Postal Code"
              icon={MapPin}
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </>
        ) : null}

        {activeTab === 'payments' ? (
          <>
            <InputField
              id="supplier-payment-terms"
              name="paymentTerms"
              label="Payment Terms"
              icon={CreditCard}
              value={formData.paymentTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Example: Net 30"
            />
            <InputField
              id="supplier-credit-days"
              name="creditDays"
              label="Credit Days"
              icon={CreditCard}
              type="number"
              value={formData.creditDays}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.creditDays ? errors.creditDays : ''}
            />
          </>
        ) : null}

        <div className="button-row supplier-form__actions field--full">
          <button className="button button-primary" disabled={!canSubmit || !isValid}>
            <Save size={16} />
            Save Supplier
          </button>
          <button type="button" className="button" onClick={onCancel}>
            <RotateCcw size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
