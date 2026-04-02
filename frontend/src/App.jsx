import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import ReaderDashboard from './pages/ReaderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import LibrarianDashboard from './pages/LibrarianDashboard'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

const AppRoutes = () => {
  const { user } = useAuth()

  if (user) {
    const dashboardMap = {
      reader: '/reader-dashboard',
      admin: '/admin-dashboard',
      librarian: '/librarian-dashboard',
    }
    return <Navigate to={dashboardMap[user.role]} replace />
  }

  return <Login />
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<AppRoutes />} />
          <Route path="/reader-dashboard" element={
            <ProtectedRoute role="reader"><ReaderDashboard /></ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/librarian-dashboard" element={
            <ProtectedRoute role="librarian"><LibrarianDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
