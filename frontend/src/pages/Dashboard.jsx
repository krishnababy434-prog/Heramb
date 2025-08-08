import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get('/orders?limit=5')).data.orders })
  const { data: expenses, isLoading: expensesLoading, isError: expensesError } = useQuery({ queryKey: ['expenses'], queryFn: async () => (await api.get('/expenses?limit=5')).data.expenses })

  const totalToday = orders?.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).reduce((s, o) => s + Number(o.total), 0) || 0

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Sales Today</div><div className="text-2xl font-bold">₹ {totalToday.toFixed(2)}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Recent Orders</div>{ordersLoading? <div className="text-xs text-gray-500">Loading...</div> : ordersError ? <div className="text-xs text-red-600">Error</div> : <ul className="text-sm">{orders?.length? orders.map(o=> <li key={o.id}>#{o.id} — ₹{o.total}</li>) : <li className="text-gray-500">No data</li>}</ul>}</div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Recent Expenses</div>{expensesLoading? <div className="text-xs text-gray-500">Loading...</div> : expensesError ? <div className="text-xs text-red-600">Error</div> : <ul className="text-sm">{expenses?.length? expenses.map(e=> <li key={e.id}>{e.title} — ₹{e.amount}</li>) : <li className="text-gray-500">No data</li>}</ul>}</div>
      </div>
    </div>
  )
}