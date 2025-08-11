import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { assetUrl, defaultImage } from '../lib/assets'

export default function SellerDashboard() {
  const qc = useQueryClient()
  const { data: menus, isLoading: menusLoading } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const { data: combos, isLoading: combosLoading } = useQuery({ queryKey: ['combos'], queryFn: async () => (await api.get('/combos')).data.combos })
  const { data: draft, isLoading: draftLoading } = useQuery({ queryKey: ['draftOrder'], queryFn: async () => (await api.get('/orders/current')).data.order })

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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['draftOrder'] }); qc.invalidateQueries({ queryKey: ['orders'] }) }
  })

  const inc = (item) => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })
  const dec = (item) => item.quantity > 1 ? updateItem.mutate({ id: item.id, quantity: item.quantity - 1 }) : removeItem.mutate({ id: item.id })

  const findItemForMenu = (menuId) => draft?.items?.find(it => it.menu_id === menuId)
  const findItemForCombo = (comboId) => draft?.items?.find(it => it.combo_id === comboId)

  return (
    <div className="min-h-[70vh]">
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#111' }}>Hungry? Let's serve!</h2>
        <div className="text-sm text-gray-600">Tap + to add items. Theme: yellow and black with energetic vibes.</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {menus?.map(m => {
          const curr = findItemForMenu(m.id)
          return (
            <div key={`m-${m.id}`} className="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <img src={assetUrl(m.photo_url) || defaultImage} className="w-full h-36 object-cover" />
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
            <div key={`c-${c.id}`} className="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <img src={assetUrl(c.photo_url) || defaultImage} className="w-full h-36 object-cover" />
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

      <div className="fixed left-0 right-0 bottom-0 z-20">
        <div className="max-w-5xl mx-auto p-3">
          <div className="rounded-2xl shadow-lg flex items-center justify-between px-4 py-3" style={{ background:'#111', color:'#fff' }}>
            <div className="text-sm">
              <div className="opacity-80">Total</div>
              <div className="text-2xl font-bold">₹ {Number(draft?.total || 0).toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <input className="hidden md:block border rounded p-2 bg-white text-black" placeholder="Coupon code" onKeyDown={(e)=>{ if(e.key==='Enter') applyCoupon.mutate({ code: e.currentTarget.value }) }} />
              <button className="px-5 py-3 rounded-full font-semibold" style={{ background:'#FFD20A', color:'#111' }} onClick={()=>{
                const name = 'Walk-in'
                const mob = ''
                submit.mutate({ customer_name: name, mobile: mob })
              }}>Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}