import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function SellerOrders() {
  const qc = useQueryClient()
  const todayStr = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [from, setFrom] = useState(todayStr)
  const [to, setTo] = useState(todayStr)

  const { data: allOrders } = useQuery({
    queryKey: ['sellerOrdersAll'],
    queryFn: async () => (await api.get('/orders?limit=200')).data.orders,
  })

  const startOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
  const todays = (allOrders||[]).filter(o => {
    const t = new Date(o.created_at)
    return t >= startOfToday && t < endOfToday
  })
  const older = (allOrders||[]).filter(o => {
    const t = new Date(o.created_at)
    return !(t >= startOfToday && t < endOfToday)
  })

  const editOrder = useMutation({
    mutationFn: async ({ id, customer_name, mobile }) => (await api.patch(`/orders/${id}`, { customer_name, mobile })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) }
  })
  const deleteOrder = useMutation({
    mutationFn: async ({ id }) => (await api.delete(`/orders/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) }
  })

  const [viewOrder, setViewOrder] = useState(null)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Previous Orders</h2>

      <div className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">Today's Orders</div>
        {(todays||[]).length === 0 && <div className="text-sm text-gray-500">No orders today</div>}
        <ul className="divide-y">
          {todays.map(o => (
            <li key={o.id} className="py-2 flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold">#{o.id} — {o.customer_name}</div>
                <div className="text-gray-600">₹ {Number(o.total).toFixed(2)} • {new Date(o.created_at).toLocaleTimeString()} • {o.mobile || 'No mobile'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-600" onClick={()=>{
                  const name = prompt('Customer name', o.customer_name)
                  if (name === null) return
                  const mob = prompt('Mobile', o.mobile || '')
                  if (mob === null) return
                  editOrder.mutate({ id: o.id, customer_name: name, mobile: mob })
                }}>Edit</button>
                <button className="text-red-600" onClick={()=>{ if (confirm('Delete this order?')) deleteOrder.mutate({ id: o.id }) }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="font-semibold mb-2">Older Orders</div>
        {(older||[]).length === 0 && <div className="text-sm text-gray-500">No older orders</div>}
        <ul className="divide-y">
          {older.map(o => (
            <li key={o.id} className="py-2 flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold">#{o.id} — {o.customer_name}</div>
                <div className="text-gray-600">₹ {Number(o.total).toFixed(2)} • {new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div>
                <button className="text-gray-700" onClick={()=> setViewOrder(o)}>View</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setViewOrder(null)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <div className="font-semibold mb-2">Order #{viewOrder.id}</div>
            <div className="text-sm mb-2">{viewOrder.customer_name} — {viewOrder.mobile || 'No mobile'}</div>
            <div className="text-sm mb-2">Placed at {new Date(viewOrder.created_at).toLocaleString()}</div>
            <div className="text-sm font-semibold">Items</div>
            <ul className="text-sm list-disc pl-5 mb-3">
              {(viewOrder.items||[]).map(it => (
                <li key={it.id}>x{it.quantity} — ₹ {Number(it.unit_price).toFixed(2)}</li>
              ))}
            </ul>
            <div className="text-right font-semibold">Total: ₹ {Number(viewOrder.total).toFixed(2)}</div>
            <div className="mt-4 text-right">
              <button className="px-4 py-2 rounded bg-gray-800 text-white" onClick={()=>setViewOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}