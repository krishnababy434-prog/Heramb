import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Dashboard() {
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get('/orders?limit=5')).data.orders })
  const { data: expenses } = useQuery({ queryKey: ['expenses'], queryFn: async () => (await api.get('/expenses?limit=5')).data.expenses })

  const totalToday = orders?.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).reduce((s, o) => s + Number(o.total), 0) || 0

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Sales Today</div><div className="text-2xl font-bold">₹ {totalToday.toFixed(2)}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Recent Orders</div><ul className="text-sm">{orders?.map(o=> <li key={o.id}>#{o.id} — ₹{o.total}</li>)}</ul></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Recent Expenses</div><ul className="text-sm">{expenses?.map(e=> <li key={e.id}>{e.title} — ₹{e.amount}</li>)}</ul></div>
      </div>
    </div>
  )
}