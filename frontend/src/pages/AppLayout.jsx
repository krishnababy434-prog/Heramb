import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AppLayout() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-6 bg-brand-yellow"></div>
            <span className="font-bold tracking-wide">Heramb Foods</span>
          </div>
          <div className="text-sm">{user?.name} ({user?.role})</div>
        </div>
      </header>
      <div className="flex">
                <aside className="w-64 bg-white border-r min-h-screen p-4 space-y-2 hidden md:block">
          <nav className="space-y-2">
            {user?.role === 'admin' && (
              <>
                <Link className="block hover:text-brand-yellow" to="/">Dashboard</Link>
                <Link className="block hover:text-brand-yellow" to="/employees">Employees</Link>
                <Link className="block hover:text-brand-yellow" to="/menus">Menus</Link>
                <Link className="block hover:text-brand-yellow" to="/combos">Combos</Link>
                <Link className="block hover:text-brand-yellow" to="/orders">Orders</Link>
                <Link className="block hover:text-brand-yellow" to="/expenses">Expenses</Link>
                <Link className="block hover:text-brand-yellow" to="/inventory">Inventory</Link>
                <Link className="block hover:text-brand-yellow" to="/coupons">Coupons</Link>
              </>
            )}
            {user?.role === 'seller' && (
              <Link className="block hover:text-brand-yellow" to="/seller">Create Order</Link>
            )}
            {user?.role === 'manager' && (
              <>
                <Link className="block hover:text-brand-yellow" to="/expenses">Expenses</Link>
                <Link className="block hover:text-brand-yellow" to="/inventory">Inventory</Link>
              </>
            )}
          </nav>
          <button onClick={logout} className="mt-6 text-sm text-red-600">Logout</button>
        </aside>
<main className="flex-1 p-4 md:p-6">
          <div className="md:hidden bg-white border-b p-2 flex gap-3 overflow-x-auto text-sm">
            {user?.role === 'admin' && (<>
              <Link to="/">Home</Link>
              <Link to="/menus">Menus</Link>
              <Link to="/combos">Combos</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/expenses">Expenses</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/coupons">Coupons</Link>
            </>)}
            {user?.role === 'seller' && <Link to="/seller">Create Order</Link>}
            {user?.role === 'manager' && (<>
              <Link to="/expenses">Expenses</Link>
              <Link to="/inventory">Inventory</Link>
            </>)}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}