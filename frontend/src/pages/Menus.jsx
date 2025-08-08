import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Menus() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', description: '', photo: null })

  const create = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('description', form.description)
      if (form.photo) fd.append('photo', form.photo)
      return (await api.post('/menus', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data
    },
    onSuccess: () => { setOpen(false); setForm({ name:'', price:'', description:'', photo: null }); qc.invalidateQueries({ queryKey: ['menus'] }) }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Menus</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>setOpen(true)}>Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.map(m => (
          <div key={m.id} className="bg-white rounded shadow">
            {m.photo_url && <img src={m.photo_url} className="w-full h-40 object-cover rounded-t" />}
            <div className="p-3">
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600">₹ {m.price}</div>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-96 space-y-2">
            <h3 className="font-semibold">Add Menu</h3>
            <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border rounded p-2 w-full" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
            <textarea className="border rounded p-2 w-full" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
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