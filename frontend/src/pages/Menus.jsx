import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { assetUrl, defaultImage } from '../lib/assets'

export default function Menus() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['menus'], queryFn: async () => (await api.get('/menus')).data.menus })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', is_available: true, photo: null })
  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || 'null'), [])

  const create = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('description', form.description)
      fd.append('is_available', String(!!form.is_available))
      if (form.photo) fd.append('photo', form.photo)
      return (await api.post('/menus', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data
    },
    onSuccess: () => { setOpen(false); setEditing(null); setForm({ name:'', price:'', description:'', is_available:true, photo: null }); qc.invalidateQueries({ queryKey: ['menus'] }) }
  })

  const update = useMutation({
    mutationFn: async () => {
      if (!editing) return
      const fd = new FormData()
      if (form.name) fd.append('name', form.name)
      if (form.price) fd.append('price', form.price)
      if (form.description) fd.append('description', form.description)
      fd.append('is_available', String(!!form.is_available))
      if (form.photo) fd.append('photo', form.photo)
      return (await api.put(`/menus/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data
    },
    onSuccess: () => { setOpen(false); setEditing(null); setForm({ name:'', price:'', description:'', is_available:true, photo: null }); qc.invalidateQueries({ queryKey: ['menus'] }) }
  })

  const del = useMutation({
    mutationFn: async (id) => (await api.delete(`/menus/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] })
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Menus</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>setOpen(true)}>Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.map(m => (
          <div key={m.id} className="bg-white rounded shadow overflow-hidden">
            <img src={assetUrl(m.photo_url) || defaultImage} onError={(e)=>{ e.currentTarget.src = defaultImage }} className="w-full h-40 object-cover" />
            <div className="p-3">
              <div className="font-semibold flex items-center justify-between">
                <span>{m.name}</span>
                <span className={`text-xs ${m.is_available ? 'text-green-600' : 'text-red-600'}`}>{m.is_available ? 'Available' : 'Hidden'}</span>
              </div>
              <div className="text-sm text-gray-600">₹ {m.price}</div>
              {user?.role === 'admin' && (
                <div className="pt-2 flex gap-2 justify-end">
                  <button className="px-2 py-1 rounded bg-gray-100" onClick={()=>{ setEditing(m); setForm({ name:m.name, price:m.price, description:m.description||'', is_available: !!m.is_available, photo:null }); setOpen(true) }}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-50 text-red-600" onClick={()=>del.mutate(m.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
</div>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-96 space-y-2">
            <h3 className="font-semibold">{editing ? 'Edit Menu' : 'Add Menu'}</h3>
            <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border rounded p-2 w-full" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
            <textarea className="border rounded p-2 w-full" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={!!form.is_available} onChange={e=>setForm({...form, is_available: e.target.checked})} /> Available</label>
            <input type="file" accept="image/*" onChange={e=>setForm({...form, photo: e.target.files?.[0] || null})} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>{ setOpen(false); setEditing(null) }} className="px-3 py-2">Cancel</button>
              {editing ? (
                <button onClick={()=>update.mutate()} className="bg-blue-600 text-white px-3 py-2 rounded">Update</button>
              ) : (
                <button onClick={()=>create.mutate()} className="bg-blue-600 text-white px-3 py-2 rounded">Save</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}