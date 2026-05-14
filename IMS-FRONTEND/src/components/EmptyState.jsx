export default function EmptyState({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="table-empty">
        <p className="empty-message">{message}</p>
      </td>
    </tr>
  )
}
