import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function TransactionChart({ reportData }) {
  return (
    <div className="card">
      <h2 className="section-title">Transactions Trend</h2>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={reportData}>
            <CartesianGrid stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="purchases"
              stroke="#0ea5b7"
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#64748b"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}