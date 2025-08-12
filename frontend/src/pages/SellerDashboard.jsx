import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { assetUrl, defaultImage } from '../lib/assets'

export default function SellerDashboard() {
  const qc = useQueryClient()
  const { data: menus, isLoading: menusLoading } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const { data: combos, isLoading: combosLoading } = useQuery({ queryKey: ['combos'], queryFn: async () => (await api.get('/combos')).data.combos })
  const { data: draft, isLoading: draftLoading } = useQuery({ queryKey: ['draftOrder'], queryFn: async () => (await api.get('/orders/current')).data.order })

  // Daily sales filter state
  const todayStr = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [from, setFrom] = useState(todayStr)
  const [to, setTo] = useState(todayStr)

  // Customer info for order placement
  const [customerName, setCustomerName] = useState('Walk-in')
  const [customerMobile, setCustomerMobile] = useState('')

  const { data: recentOrders } = useQuery({
    queryKey: ['sellerOrders', from, to],
    queryFn: async () => (await api.get(`/orders?limit=50&from=${from}&to=${to}`)).data.orders,
  })

  const addItem = useMutation({
    mutationFn: async ({ menu_id, combo_id }) => (await api.post('/orders/current/items', { menu_id, combo_id, quantity: 1 })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['draftOrder'] }) }
  })
  const updateItem = useMutation({
    mutationFn: async ({ id, quantity }) => (await api.patch(`/orders/current/items/${id}`, { quantity })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['draftOrder'] }) }
  })
  const removeItem = useMutation({
    mutationFn: async ({ id }) => (await api.delete(`/orders/current/items/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['draftOrder'] }) }
  })
  const applyCoupon = useMutation({
    mutationFn: async ({ code }) => (await api.post('/orders/current/apply-coupon', { code })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['draftOrder'] }) }
  })
  const submit = useMutation({
    mutationFn: async ({ customer_name, mobile }) => (await api.post('/orders/submit', { customer_name, mobile })).data,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['draftOrder'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['sellerOrders'] });
      const ord = data?.order
      if (ord) {
        alert(`you have place an order for ${ord.customer_name} and his mobile no is ${ord.mobile || ''} and order id is ${ord.id}`)
      }
    }
  })

  const inc = (item) => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })
  const dec = (item) => item.quantity > 1 ? updateItem.mutate({ id: item.id, quantity: item.quantity - 1 }) : removeItem.mutate({ id: item.id })

  const findItemForMenu = (menuId) => draft?.items?.find(it => it.menu_id === menuId)
  const findItemForCombo = (comboId) => draft?.items?.find(it => it.combo_id === comboId)

  const dailyTotal = useMemo(() => (recentOrders||[]).reduce((s,o)=> s + Number(o.total), 0), [recentOrders])

  return (
    <div className="min-h-[70vh]">
      <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#111' }}>Hungry? Let's serve!</h2>
          <div className="text-sm text-gray-600">Tap + to add items. Theme: yellow and black with energetic vibes.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600">Filter sales</div>
          <input type="date" className="border rounded p-2" value={from} onChange={e=>setFrom(e.target.value)} />
          <span className="text-gray-500">to</span>
          <input type="date" className="border rounded p-2" value={to} onChange={e=>setTo(e.target.value)} />
          <button className="px-3 py-2 rounded font-semibold transition transform hover:scale-105" style={{ background:'#FFD20A', color:'#111' }} onClick={()=>{ setFrom(todayStr); setTo(todayStr) }}>Today</button>
          <div className="ml-auto text-sm"><span className="text-gray-500">Total:</span> <span className="font-bold">₹ {dailyTotal.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {menus?.map(m => {
          const curr = findItemForMenu(m.id)
          return (
            <div key={`m-${m.id}`} className="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-transform duration-200 hover:scale-[1.02]">
              <div className="relative">
                <img src={assetUrl(m.photo_url) || defaultImage} onError={(e)=>{ e.currentTarget.src = defaultImage }} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition" />
              </div>
              <div className="p-3">
                <div className="font-semibold truncate">{m.name}</div>
                <div className="text-sm text-gray-600">₹ {m.price}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button aria-label="decrease" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:'#FFD20A' }} onClick={()=> curr ? dec(curr) : null}>-</button>
                  <div className="min-w-[1.5rem] text-center font-semibold">{curr?.quantity || 0}</div>
                  <button aria-label="increase" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:'#FFD20A' }} onClick={()=> curr ? inc(curr) : addItem.mutate({ menu_id: m.id })}>+</button>
                </div>
              </div>
            </div>
          )
        })}

        {combos?.map(c => {
          const curr = findItemForCombo(c.id)
          return (
            <div key={`c-${c.id}`} className="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-transform duration-200 hover:scale-[1.02]">
              <div className="relative">
                <img src={assetUrl(c.photo_url) || defaultImage} onError={(e)=>{ e.currentTarget.src = defaultImage }} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition" />
              </div>
              <div className="p-3">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-sm text-gray-600">₹ {c.price}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button aria-label="decrease" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:'#FFD20A' }} onClick={()=> curr ? dec(curr) : null}>-</button>
                  <div className="min-w-[1.5rem] text-center font-semibold">{curr?.quantity || 0}</div>
                  <button aria-label="increase" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:'#FFD20A' }} onClick={()=> curr ? inc(curr) : addItem.mutate({ combo_id: c.id })}>+</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2" />
        {/* Previous Orders section removed for a cleaner create menu experience */}
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-20">
        <div className="max-w-5xl mx-auto p-3">
          <div className="rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3" style={{ background:'#111', color:'#fff' }}>
            <div className="text-sm">
              <div className="opacity-80">Total</div>
              <div className="text-2xl font-bold">₹ {Number(draft?.total || 0).toFixed(2)}</div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <input className="hidden md:block border rounded p-2 bg-white text-black" placeholder="Coupon code" onKeyDown={(e)=>{ if(e.key==='Enter') applyCoupon.mutate({ code: e.currentTarget.value }) }} />
              <input className="border rounded p-2 bg-white text-black w-full sm:w-auto" placeholder="Customer Name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} />
              <input className="border rounded p-2 bg-white text-black w-full sm:w-40" placeholder="Mobile" value={customerMobile} onChange={(e)=>setCustomerMobile(e.target.value)} />
              <button className="px-5 py-3 rounded-full font-semibold transition transform hover:scale-105" style={{ background:'#FFD20A', color:'#111' }} onClick={()=>{
                submit.mutate({ customer_name: customerName || 'Walk-in', mobile: customerMobile || '' })
              }}>Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}