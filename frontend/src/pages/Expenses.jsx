import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Expenses() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['expenses'], queryFn: async () => (await api.get('/expenses?limit=50')).data.expenses })
  const [form, setForm] = useState({ title: '', amount: '', note: '', category: '' })

  const create = useMutation({
    mutationFn: async () => (await api.post('/expenses', form)).data,
    onSuccess: () => { setForm({ title:'', amount:'', note:'', category:'' }); qc.invalidateQueries({ queryKey: ['expenses'] }) }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Expenses</h2>
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input className="border rounded p-2" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
        <input className="border rounded p-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
        <input className="border rounded p-2 md:col-span-2" placeholder="Note" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
        <div className="md:col-span-2 text-right"><button onClick={()=>create.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button></div>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead><tr className="text-left"><th className="p-2">Title</th><th className="p-2">Amount</th><th className="p-2">Category</th><th className="p-2">Date</th></tr></thead>
        <tbody>
          {data?.map(e => <tr key={e.id} className="border-t"><td className="p-2">{e.title}</td><td className="p-2">₹ {e.amount}</td><td className="p-2">{e.category}</td><td className="p-2">{new Date(e.created_at).toLocaleString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}