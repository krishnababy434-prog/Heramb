import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Inventory() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['inventory'], queryFn: async () => (await api.get('/inventory')).data.items })
  const [form, setForm] = useState({ name: '', unit: '', quantity: 0, threshold_alert: '' })

  const create = useMutation({
    mutationFn: async () => (await api.post('/inventory', form)).data,
    onSuccess: () => { setForm({ name:'', unit:'', quantity:0, threshold_alert:'' }); qc.invalidateQueries({ queryKey: ['inventory'] }) }
  })

  const adjust = useMutation({
    mutationFn: async ({ id, delta }) => (await api.post(`/inventory/${id}/adjust`, { delta })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] })
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-5 gap-2">
        <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="border rounded p-2" placeholder="Unit" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} />
        <input className="border rounded p-2" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} />
        <input className="border rounded p-2" placeholder="Threshold" value={form.threshold_alert} onChange={e=>setForm({...form, threshold_alert:e.target.value})} />
        <div className="text-right"><button onClick={()=>create.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button></div>
      </div>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Unit</th><th className="p-2">Qty</th><th className="p-2">Threshold</th><th className="p-2">Adjust</th></tr></thead>
        <tbody>
          {data?.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.unit}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">{i.threshold_alert}</td>
              <td className="p-2 space-x-2">
                <button onClick={()=>adjust.mutate({ id: i.id, delta: 1 })} className="px-2 py-1 bg-green-600 text-white rounded">+1</button>
                <button onClick={()=>adjust.mutate({ id: i.id, delta: -1 })} className="px-2 py-1 bg-red-600 text-white rounded">-1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}