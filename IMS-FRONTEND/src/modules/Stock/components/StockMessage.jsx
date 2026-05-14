export default function StockMessage({ message }) {
  if (!message) return null

  return (
    <div
      className={`message-box ${
        message.success ? 'message-box--success' : 'message-box--error'
      }`}
    >
      {message.message}
    </div>
  )
}
