export const IMS_TOAST_EVENT = 'ims:toast'

export function showToast(detail) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(IMS_TOAST_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        duration: 3600,
        type: 'info',
        ...detail,
      },
    }),
  )
}
