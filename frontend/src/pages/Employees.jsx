import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Employees() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['employees'], queryFn: async () => (await api.get('/admin/employees')).data.employees })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirm: '', role: 'seller' })
  const [error, setError] = useState('')

  const create = useMutation({
    mutationFn: async () => (await api.post('/admin/employees', form)).data,
    onSuccess: () => { setOpen(false); setForm({ name:'', email:'', password:'', password_confirm:'', role:'seller' }); qc.invalidateQueries({ queryKey: ['employees'] }) },
    onError: (err) => { setError(err.response?.data?.message || 'Failed to create') }
  })

  const passwordsMismatch = form.password && form.password_confirm && form.password !== form.password_confirm

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>{setError(''); setOpen(true)}}>Add</button>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Mobile</th><th className="p-2">Role</th><th className="p-2 text-right">Actions</th></tr></thead>
        <tbody>
          {data?.map(e=> (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.name}</td>
              <td className="p-2">{e.email}</td>
              <td className="p-2">{e.mobile}</td>
              <td className="p-2">{e.role}</td>
              <td className="p-2">
                <div className="flex gap-2 justify-end">
                  <button className="px-2 py-1 rounded bg-gray-100">Edit</button>
                  <button className="px-2 py-1 rounded bg-red-50 text-red-600">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-96 space-y-2">
            <h3 className="font-semibold">Add Employee</h3>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <input className="border rounded p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border rounded p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <select className="border rounded p-2 w-full" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="seller">Seller</option>
              <option value="manager">Manager</option>
            </select>
            <input className="border rounded p-2 w-full" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
            <input className={`border rounded p-2 w-full ${passwordsMismatch ? 'border-red-500' : ''}`} type="password" placeholder="Confirm Password" value={form.password_confirm} onChange={e=>setForm({...form, password_confirm:e.target.value})} />
            {passwordsMismatch && <div className="text-red-600 text-xs">Passwords do not match</div>}
            <div className="flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-2">Cancel</button>
              <button disabled={passwordsMismatch} onClick={()=>create.mutate()} className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}