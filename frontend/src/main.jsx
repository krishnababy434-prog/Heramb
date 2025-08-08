import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Menus from './pages/Menus'
import Combos from './pages/Combos'
import Orders from './pages/Orders'
import Expenses from './pages/Expenses'
import Inventory from './pages/Inventory'
import AppLayout from './pages/AppLayout'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'employees', element: <Employees /> },
      { path: 'menus', element: <Menus /> },
      { path: 'combos', element: <Combos /> },
      { path: 'orders', element: <Orders /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'inventory', element: <Inventory /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
