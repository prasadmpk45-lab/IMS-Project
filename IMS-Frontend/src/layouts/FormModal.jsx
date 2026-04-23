import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './FormModal.css'

export default function FormModal({ children, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      className="form-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="form-modal__dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="button form-modal__close"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={16} />
          Close
        </button>
        <div className="form-modal__content">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
