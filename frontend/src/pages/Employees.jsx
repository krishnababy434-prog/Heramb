import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Employees() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['employees'], queryFn: async () => (await api.get('/admin/employees')).data.employees })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const create = useMutation({
    mutationFn: async () => (await api.post('/admin/employees', form)).data,
    onSuccess: () => { setOpen(false); setForm({ name:'', email:'', password:'' }); qc.invalidateQueries({ queryKey: ['employees'] }) }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>setOpen(true)}>Add</button>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Mobile</th></tr></thead>
        <tbody>
          {data?.map(e=> <tr key={e.id} className="border-t"><td className="p-2">{e.name}</td><td className="p-2">{e.email}</td><td className="p-2">{e.mobile}</td></tr>)}
        </tbody>
      </table>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-96 space-y-2">
            <h3 className="font-semibold">Add Employee</h3>
            <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border rounded p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <input className="border rounded p-2 w-full" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
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