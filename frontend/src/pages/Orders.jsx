import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Orders() {
  const qc = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { data: menus } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const { data: combos } = useQuery({ queryKey: ['combos'], queryFn: async () => (await api.get('/combos')).data.combos })
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get('/orders?limit=20')).data.orders })

  const [customer_name, setCustomer] = useState('Walk-in')
  const [mobile, setMobile] = useState('')
  const [items, setItems] = useState([])
  const [coupon_code, setCoupon] = useState('')

  const addItem = (type, id, name, price) => {
    setItems(prev => [...prev, { menu_id: type==='menu' ? id : undefined, combo_id: type==='combo' ? id : undefined, quantity: 1, unit_price: price, name }])
  }
  const updateQty = (idx, q) => setItems(prev => prev.map((it,i)=> i===idx ? { ...it, quantity: q } : it))
  const removeItem = (idx) => setItems(prev => prev.filter((_,i)=>i!==idx))
  const subtotal = items.reduce((s,it)=> s + Number(it.unit_price)*Number(it.quantity), 0)
  const discount = 0 // client-side preview left 0; server computes real discount

  const create = useMutation({
    mutationFn: async () => (await api.post('/orders', { customer_name, mobile, items, coupon_code })).data,
    onSuccess: () => { setItems([]); qc.invalidateQueries({ queryKey: ['orders'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to create order') }
  })

  const editOrder = useMutation({
    mutationFn: async ({ id, customer_name, mobile }) => (await api.patch(`/orders/${id}`, { customer_name, mobile })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to edit order') }
  })
  const deleteOrder = useMutation({
    mutationFn: async ({ id }) => (await api.delete(`/orders/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
    onError: (err) => { alert(err?.response?.data?.message || 'Failed to delete order') }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Orders / Billing</h2>
      {user?.role !== 'admin' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow space-y-3">
          <div className="flex gap-2">
            <input className="border rounded p-2 flex-1" placeholder="Customer Name" value={customer_name} onChange={e=>setCustomer(e.target.value)} />
            <input className="border rounded p-2 w-40" placeholder="Mobile (optional)" value={mobile} onChange={e=>setMobile(e.target.value)} />
          </div>
          <div>
            <div className="font-semibold mb-2">Menus</div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
              {menus?.map(m => <button key={m.id} onClick={()=>addItem('menu', m.id, m.name, m.price)} className="border rounded p-2 text-left hover:bg-gray-50">{m.name}<div className="text-xs text-gray-500">₹ {m.price}</div></button>)}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Combos</div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
              {combos?.map(c => <button key={c.id} onClick={()=>addItem('combo', c.id, c.name, c.price)} className="border rounded p-2 text-left hover:bg-gray-50">{c.name}<div className="text-xs text-gray-500">₹ {c.price}</div></button>)}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <div className="font-semibold">Bill</div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th className="p-2">Item</th><th className="p-2">Qty</th><th className="p-2">Rate</th><th className="p-2">Amt</th><th></th></tr></thead>
              <tbody>
                {items.map((it, idx)=> (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{it.name}</td>
                    <td className="p-2"><input type="number" min={1} className="border rounded p-1 w-16" value={it.quantity} onChange={e=>updateQty(idx, Number(e.target.value))} /></td>
                    <td className="p-2">₹ {it.unit_price}</td>
                    <td className="p-2">₹ {(Number(it.unit_price)*Number(it.quantity)).toFixed(2)}</td>
                    <td className="p-2 text-right"><button onClick={()=>removeItem(idx)} className="text-red-600">x</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right font-semibold">Subtotal: ₹ {subtotal.toFixed(2)}</div>
          <div className="flex gap-2 justify-end">
            <input className="border rounded p-2" placeholder="Coupon code" value={coupon_code} onChange={e=>setCoupon(e.target.value)} />
          </div>
          <button onClick={()=>create.mutate()} className="bg-green-600 text-white px-4 py-2 rounded">Create Order</button>
        </div>
      </div>
      )}
      <div>
        <h3 className="font-semibold mb-2">Recent Orders</h3>
        <ul className="text-sm bg-white rounded shadow divide-y">
          {orders?.map(o => (
            <li key={o.id} className="p-2 flex items-center justify-between">
              <div>#{o.id} — {o.customer_name} — ₹ {o.total}</div>
              {user?.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <button className="text-blue-600" onClick={()=>{
                    const name = prompt('Customer name', o.customer_name)
                    if (name === null) return
                    const mob = prompt('Mobile', o.mobile || '')
                    if (mob === null) return
                    editOrder.mutate({ id: o.id, customer_name: name, mobile: mob })
                  }}>Edit</button>
                  <button className="text-red-600" onClick={()=>{
                    if (confirm('Delete this order?')) deleteOrder.mutate({ id: o.id })
                  }}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}