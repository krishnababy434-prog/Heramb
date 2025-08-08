import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AppLayout() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-60 bg-white border-r min-h-screen p-4 space-y-2">
          <h1 className="text-xl font-semibold mb-4">Heramb Admin</h1>
          <nav className="space-y-2">
            <Link className="block hover:underline" to="/">Dashboard</Link>
            <Link className="block hover:underline" to="/employees">Employees</Link>
            <Link className="block hover:underline" to="/menus">Menus</Link>
            <Link className="block hover:underline" to="/combos">Combos</Link>
            <Link className="block hover:underline" to="/orders">Orders</Link>
            <Link className="block hover:underline" to="/expenses">Expenses</Link>
            <Link className="block hover:underline" to="/inventory">Inventory</Link>
          </nav>
          <button onClick={logout} className="mt-6 text-sm text-red-600">Logout</button>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}