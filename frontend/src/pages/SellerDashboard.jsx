import { } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Menus</h3>
            {menusLoading ? <div className="text-sm text-gray-500">Loading...</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {menus?.map(m => (
                  <div key={m.id} className="bg-white rounded shadow overflow-hidden">
                    {m.photo_url && <img src={m.photo_url} className="w-full h-28 object-cover" />}
                    <div className="p-2">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-gray-600">₹ {m.price}</div>
                    </div>
                    <button className="w-full bg-brand-yellow text-black py-1" onClick={()=>addItem.mutate({ menu_id: m.id })}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h3 className="font-semibold mb-2">Combos</h3>
            {combosLoading ? <div className="text-sm text-gray-500">Loading...</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {combos?.map(c => (
                  <div key={c.id} className="bg-white rounded shadow overflow-hidden">
                    {c.photo_url && <img src={c.photo_url} className="w-full h-28 object-cover" />}
                    <div className="p-2">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-gray-600">₹ {c.price}</div>
                    </div>
                    <button className="w-full bg-brand-yellow text-black py-1" onClick={()=>addItem.mutate({ combo_id: c.id })}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="bg-white rounded shadow p-4 space-y-2">
          <div className="font-semibold">Current Order</div>
          {draftLoading ? <div className="text-sm text-gray-500">Loading...</div> : (
            <>
              <ul className="divide-y text-sm">
                {draft?.items?.map(it => (
                  <li key={it.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="flex-1 truncate">{it.menu_id ? `Menu #${it.menu_id}` : `Combo #${it.combo_id}`}</div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 bg-gray-200 rounded" onClick={()=>dec(it)}>-</button>
                      <div>{it.quantity}</div>
                      <button className="px-2 py-1 bg-gray-200 rounded" onClick={()=>inc(it)}>+</button>
                    </div>
                    <div className="w-20 text-right">₹ {(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-right space-y-1 text-sm">
                <div>Subtotal: ₹ {Number(draft?.subtotal || 0).toFixed(2)}</div>
                {Number(draft?.discount||0) > 0 && <div className="text-green-700">Discount: -₹ {Number(draft.discount).toFixed(2)}</div>}
                <div>Tax: ₹ {Number(draft?.tax || 0).toFixed(2)}</div>
                <div className="font-semibold text-lg">Total: ₹ {Number(draft?.total || 0).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <input className="border rounded p-2 flex-1" placeholder="Coupon code" onKeyDown={(e)=>{ if(e.key==='Enter') applyCoupon.mutate({ code: e.currentTarget.value }) }} />
                <button className="bg-black text-white px-3 py-2 rounded" onClick={()=>{ const input = document.activeElement; if (input && input.tagName==='INPUT') applyCoupon.mutate({ code: input.value }) }}>Apply</button>
              </div>
              <div className="flex gap-2">
                <input id="customer_name" className="border rounded p-2 flex-1" defaultValue={draft?.customer_name || 'Walk-in'} placeholder="Customer name" />
                <input id="mobile" className="border rounded p-2 flex-1" placeholder="Mobile (optional)" />
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded" onClick={()=>{
                const name = document.getElementById('customer_name')?.value || 'Walk-in';
                const mob = document.getElementById('mobile')?.value || '';
                submit.mutate({ customer_name: name, mobile: mob })
              }}>Submit Order</button>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}