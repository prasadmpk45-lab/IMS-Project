import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function TransactionChart({ data }) {
  return (
    <div className="card">
      <h2 className="section-title">Monthly Purchases vs Sales</h2>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="purchases" stroke="#0ea5b7" />
            <Line type="monotone" dataKey="sales" stroke="#64748b" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
