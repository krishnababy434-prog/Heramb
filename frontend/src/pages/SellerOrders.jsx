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

  // Needed to show full item catalog in the editor, same as create order
  const { data: menus } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const { data: combos } = useQuery({ queryKey: ['combos'], queryFn: async () => (await api.get('/combos')).data.combos })

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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to edit order') }
  })
  const deleteOrder = useMutation({
    mutationFn: async ({ id }) => (await api.delete(`/orders/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to delete order') }
  })

  const [viewOrder, setViewOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [editCustomer, setEditCustomer] = useState('')
  const [editMobile, setEditMobile] = useState('')

  // Maps for item names
  const menuNameById = useMemo(() => Object.fromEntries((menus||[]).map(m => [m.id, m.name])), [menus])
  const comboNameById = useMemo(() => Object.fromEntries((combos||[]).map(c => [c.id, c.name])), [combos])

  const addItemToOrder = useMutation({
    mutationFn: async ({ orderId, menu_id, combo_id, quantity }) => (await api.post(`/orders/${orderId}/items`, { menu_id, combo_id, quantity })).data.order,
    onSuccess: (order) => { setEditingOrder(order); qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to add item') }
  })
  const updateOrderItem = useMutation({
    mutationFn: async ({ orderId, itemId, quantity }) => (await api.patch(`/orders/${orderId}/items/${itemId}`, { quantity })).data.order,
    onSuccess: (order) => { setEditingOrder(order); qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to update item') }
  })
  const removeOrderItem = useMutation({
    mutationFn: async ({ orderId, itemId }) => (await api.delete(`/orders/${orderId}/items/${itemId}`)).data.order,
    onSuccess: (order) => { setEditingOrder(order); qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to remove item') }
  })

  const saveBasics = useMutation({
    mutationFn: async ({ id, customer_name, mobile }) => (await api.patch(`/orders/${id}`, { customer_name, mobile })).data.order,
    onSuccess: () => { setEditingOrder(null); qc.invalidateQueries({ queryKey: ['sellerOrdersAll'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to save order') }
  })

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
                <button className="text-blue-600" onClick={()=>{ setEditingOrder(o); setEditCustomer(o.customer_name); setEditMobile(o.mobile || '') }}>Edit</button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={()=>setViewOrder(null)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4" onClick={(e)=>e.stopPropagation()}>
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

      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={()=>setEditingOrder(null)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Edit Order #{editingOrder.id}</div>
              <button className="text-gray-600" onClick={()=>setEditingOrder(null)}>✕</button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <input className="border rounded p-2 flex-1" placeholder="Customer Name" value={editCustomer} onChange={e=>setEditCustomer(e.target.value)} />
                  <input className="border rounded p-2 w-48" placeholder="Mobile (optional)" value={editMobile} onChange={e=>setEditMobile(e.target.value)} />
                </div>
                <div>
                  <div className="font-semibold mb-2">Menus</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto">
                    {(menus||[]).map(m => (
                      <button key={m.id} onClick={()=>addItemToOrder.mutate({ orderId: editingOrder.id, menu_id: m.id, quantity: 1 })} className="border rounded p-2 text-left hover:bg-gray-50">
                        {m.name}
                        <div className="text-xs text-gray-500">₹ {m.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Combos</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto">
                    {(combos||[]).map(c => (
                      <button key={c.id} onClick={()=>addItemToOrder.mutate({ orderId: editingOrder.id, combo_id: c.id, quantity: 1 })} className="border rounded p-2 text-left hover:bg-gray-50">
                        {c.name}
                        <div className="text-xs text-gray-500">₹ {c.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="font-semibold">Bill</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Item</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">Amt</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(editingOrder.items||[]).map((it) => {
                      const name = it.menu_id ? (menuNameById[it.menu_id] || `Menu #${it.menu_id}`) : it.combo_id ? (comboNameById[it.combo_id] || `Combo #${it.combo_id}`) : 'Item'
                      const amount = (Number(it.unit_price) * Number(it.quantity)).toFixed(2)
                      return (
                        <tr key={it.id} className="border-t">
                          <td className="p-2">{name}</td>
                          <td className="p-2">
                            <input type="number" min={1} className="border rounded p-1 w-16" value={it.quantity}
                              onChange={e=>{
                                const q = Number(e.target.value)
                                if (!Number.isFinite(q) || q <= 0) return
                                updateOrderItem.mutate({ orderId: editingOrder.id, itemId: it.id, quantity: q })
                              }} />
                          </td>
                          <td className="p-2">₹ {it.unit_price}</td>
                          <td className="p-2">₹ {amount}</td>
                          <td className="p-2 text-right">
                            <button className="text-red-600" onClick={()=>removeOrderItem.mutate({ orderId: editingOrder.id, itemId: it.id })}>x</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="text-right space-y-1">
                  <div>Subtotal: ₹ {Number(editingOrder.subtotal||0).toFixed(2)}</div>
                  {Number(editingOrder.discount||0) > 0 && <div>Discount: -₹ {Number(editingOrder.discount).toFixed(2)}</div>}
                  {Number(editingOrder.tax||0) > 0 && <div>Tax: ₹ {Number(editingOrder.tax).toFixed(2)}</div>}
                  <div className="font-semibold">Total: ₹ {Number(editingOrder.total||0).toFixed(2)}</div>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button className="px-4 py-2 rounded border" onClick={()=>setEditingOrder(null)}>Cancel</button>
                  <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={()=>saveBasics.mutate({ id: editingOrder.id, customer_name: editCustomer, mobile: editMobile || null })}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}