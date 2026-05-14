import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function CategoryChart({ data }) {
  return (
    <div className="card">
      <h2 className="section-title">Stock by Category</h2>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e5e5e5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#0ea5b7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
