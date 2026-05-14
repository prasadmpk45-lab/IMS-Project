import { CalendarDays, Layers3, MapPin, RotateCcw, Save, Settings, UserRound, Warehouse } from 'lucide-react'
import { useState } from 'react'
import DatePicker from '../../../components/DatePicker'
import InputField from '../../../components/InputField'
import SearchableSelect from '../../../components/SearchableSelect'
import { getNameError, getNumberError } from '../../../utils/helpers'
import './WarehouseForm.css'

const emptyForm = {
  name: '',
  location: '',
  status: 'Active',
  manager: 'Auto Assigned',
  createdDate: '',
  rackCount: '0',
  binCount: '0',
}

export default function WarehouseForm({ initialValues, canSubmit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialValues ? { ...emptyForm, ...initialValues } : emptyForm)
  const [touched, setTouched] = useState({})

  const errors = {
    name: getNameError(formData.name, 'Warehouse name'),
    rackCount: getNumberError(formData.rackCount, 'Rack count', { min: 0 }),
    binCount: getNumberError(formData.binCount, 'Bin count', { min: 0 }),
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
      rackCount: true,
      binCount: true,
    })

    if (!isValid) {
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="warehouse-form">
      <form onSubmit={handleSubmit} className="form-grid warehouse-form__grid">
          <InputField
            id="warehouse-name"
            name="name"
            label="Warehouse Name"
            icon={Warehouse}
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ''}
          />

          <InputField
            id="warehouse-location"
            name="location"
            label="Location"
            icon={MapPin}
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <InputField
            id="warehouse-manager"
            name="manager"
            label="Manager"
            icon={UserRound}
            value={formData.manager}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SearchableSelect
            id="warehouse-status"
            name="status"
            label="Status"
            icon={Settings}
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            placeholder="Select status"
          />

          <DatePicker
            id="warehouse-created-date"
            name="createdDate"
            label="Created Date"
            value={formData.createdDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <InputField
            id="warehouse-rack-count"
            name="rackCount"
            label="Rack Count"
            icon={Layers3}
            type="number"
            value={formData.rackCount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.rackCount ? errors.rackCount : ''}
          />

          <InputField
            id="warehouse-bin-count"
            name="binCount"
            label="Bin Count"
            icon={Layers3}
            type="number"
            value={formData.binCount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.binCount ? errors.binCount : ''}
          />

          <div className="button-row warehouse-form__actions">
            <button type="submit" className="button button-primary" disabled={!canSubmit || !isValid}>
              <Save size={16} />
              Save Warehouse
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
