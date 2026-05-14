import {
  Bell,
  CalendarDays,
  FileText,
  RotateCcw,
  Save,
  Tag,
} from 'lucide-react'
import { useState } from 'react'
import SearchableSelect from '../../../components/SearchableSelect'
import { getToday } from '../../../utils/helpers'

const initialForm = {
  title: '',
  type: 'Info',
  message: '',
  date: getToday(),
}

export default function NotificationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialForm)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="card">
      <h2 className="section-title">New Alert</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <input name="title" onChange={handleChange} />

        <SearchableSelect
          name="type"
          icon={Bell}
          value={formData.type}
          onChange={handleChange}
          options={['Info', 'Action', 'Critical']}
        />

        <input type="date" name="date" onChange={handleChange} />

        <textarea name="message" onChange={handleChange} />

        <button><Save size={16}/>Save</button>
        <button type="button" onClick={onCancel}>
          <RotateCcw size={16}/>Cancel
        </button>
      </form>
    </div>
  )
}