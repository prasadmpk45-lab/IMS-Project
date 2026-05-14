import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './FormModal.css'

export default function FormModal({ title, subtitle, children, onClose }) {
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
        <div className="form-modal__header">
          <div>
            {title ? <h2 className="form-modal__title">{title}</h2> : null}
            {subtitle ? (
              <p className="form-modal__subtitle">{subtitle}</p>
            ) : null}
          </div>

          <button
            type="button"
            className="form-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="form-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
