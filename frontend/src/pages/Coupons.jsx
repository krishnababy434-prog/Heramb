import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Coupons() {
  const qc = useQueryClient()
  const { data: coupons, isLoading, isError, error } = useQuery({ queryKey: ['coupons'], queryFn: async () => (await api.get('/coupons')).data.coupons })
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', start_date: '', end_date: '', max_uses: '', is_active: true })

  const create = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        value: Number(form.value),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
      }
      return (await api.post('/coupons', payload)).data
    },
    onSuccess: () => { setForm({ code:'', type:'percentage', value:'', start_date:'', end_date:'', max_uses:'', is_active: true }); qc.invalidateQueries({ queryKey: ['coupons'] }) }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Coupons</h2>
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-6 gap-2">
        <input className="border rounded p-2" placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
        <select className="border rounded p-2" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="percentage">Percentage %</option>
          <option value="fixed">Fixed ₹</option>
        </select>
        <input className="border rounded p-2" placeholder="Value" value={form.value} onChange={e=>setForm({...form, value:e.target.value})} />
        <input className="border rounded p-2" type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} />
        <input className="border rounded p-2" type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} />
        <input className="border rounded p-2" placeholder="Max Uses (optional)" value={form.max_uses} onChange={e=>setForm({...form, max_uses:e.target.value})} />
        <label className="flex items-center gap-2 md:col-span-2"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label>
        <div className="md:col-span-2 text-right"><button onClick={()=>create.mutate()} className="bg-brand-yellow text-black px-4 py-2 rounded">Add</button></div>
      </div>
      {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
      {isError && <div className="text-sm text-red-600">{error?.message || 'Error loading coupons'}</div>}
      <table className="w-full bg-white rounded shadow text-sm">
        <thead><tr className="text-left"><th className="p-2">Code</th><th className="p-2">Type</th><th className="p-2">Value</th><th className="p-2">Active</th><th className="p-2">Uses</th><th className="p-2">Dates</th></tr></thead>
        <tbody>
          {coupons?.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2 font-mono">{c.code}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.type==='percentage' ? `${c.value}%` : `₹ ${c.value}`}</td>
              <td className="p-2">{c.is_active ? 'Yes' : 'No'}</td>
              <td className="p-2">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
              <td className="p-2">{new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}