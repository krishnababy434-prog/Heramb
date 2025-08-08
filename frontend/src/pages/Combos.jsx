import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Combos() {
  const qc = useQueryClient()
  const { data: combos } = useQuery({ queryKey: ['combos'], queryFn: async () => (await api.get('/combos')).data.combos })
  const { data: menus } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', items: [], photo: null })

  const create = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('items', JSON.stringify(form.items))
      if (form.photo) fd.append('photo', form.photo)
      return (await api.post('/combos', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data
    },
    onSuccess: () => { setOpen(false); setForm({ name:'', price:'', items:[], photo: null }); qc.invalidateQueries({ queryKey: ['combos'] }) }
  })

  const toggleItem = (menuId) => {
    setForm(prev => {
      const exists = prev.items.find(i => i.menu_id === menuId)
      if (exists) return { ...prev, items: prev.items.filter(i => i.menu_id !== menuId) }
      return { ...prev, items: [...prev.items, { menu_id: menuId, quantity: 1 }] }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Combos</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>setOpen(true)}>Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {combos?.map(c => (
          <div key={c.id} className="bg-white rounded shadow">
            {c.photo_url && <img src={c.photo_url} className="w-full h-40 object-cover rounded-t" />}
            <div className="p-3">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-600">₹ {c.price}</div>
              <div className="text-xs text-gray-500">{c.items?.length} items</div>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-[30rem] space-y-2">
            <h3 className="font-semibold">Add Combo</h3>
            <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border rounded p-2 w-full" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
            <div className="border rounded p-2 h-40 overflow-auto">
              {menus?.map(m => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!form.items.find(i=>i.menu_id===m.id)} onChange={()=>toggleItem(m.id)} />
                  {m.name}
                </label>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={e=>setForm({...form, photo: e.target.files?.[0] || null})} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-2">Cancel</button>
              <button onClick={()=>create.mutate()} className="bg-blue-600 text-white px-3 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}