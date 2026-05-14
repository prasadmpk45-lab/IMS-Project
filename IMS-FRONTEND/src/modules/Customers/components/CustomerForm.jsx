import { Building2, CircleDollarSign, Mail, MapPin, Phone, RotateCcw, Save, User } from 'lucide-react'
import { useState } from 'react'
import InputField from '../../../components/InputField'
import { getEmailError, getNameError, getNumberError, getRequiredError } from '../../../utils/helpers'

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  city: '',
  creditLimit: '',
  balance: '',
}

function getInitialForm(initialValues) {
  return initialValues ? { ...emptyForm, ...initialValues } : emptyForm
}

export default function CustomerForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialValues))
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name, 'Customer name'),
    company: getRequiredError(formData.company, 'Company'),
    email: getEmailError(formData.email),
    phone: getRequiredError(formData.phone, 'Phone'),
    city: getRequiredError(formData.city, 'City'),
    creditLimit: getNumberError(formData.creditLimit, 'Credit limit', { min: 0 }),
    balance: getNumberError(formData.balance, 'Outstanding balance', { min: 0 }),
  }

  const isFormValid = Object.values(errors).every((value) => !value)

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
      company: true,
      email: true,
      phone: true,
      city: true,
      creditLimit: true,
      balance: true,
    })

    if (!isFormValid) {
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="customer-form">
      <form onSubmit={handleSubmit} className="form-grid customer-form__grid">
        <InputField
          id="customer-name"
          name="name"
          label="Customer Name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : ''}
        />

        <InputField
          id="customer-company"
          name="company"
          label="Company"
          icon={Building2}
          value={formData.company}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.company ? errors.company : ''}
        />

        <InputField
          id="customer-email"
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
          id="customer-phone"
          name="phone"
          label="Phone"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : ''}
        />

        <InputField
          id="customer-city"
          name="city"
          label="City"
          icon={MapPin}
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.city ? errors.city : ''}
        />

        <InputField
          id="customer-credit-limit"
          name="creditLimit"
          label="Credit Limit"
          icon={CircleDollarSign}
          type="number"
          value={formData.creditLimit}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.creditLimit ? errors.creditLimit : ''}
        />

        <InputField
          id="customer-balance"
          name="balance"
          label="Outstanding Balance"
          icon={CircleDollarSign}
          type="number"
          value={formData.balance}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.balance ? errors.balance : ''}
        />

        <div className="button-row customer-form__actions field--full">
          <button className="button button-primary" disabled={!canSubmit || !isFormValid}>
            <Save size={16} />
            Save Customer
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
