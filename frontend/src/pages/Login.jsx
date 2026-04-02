import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('reader')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const demoUsers = [
    { email: 'reader@library.com', role: '读者' },
    { email: 'admin@library.com', role: '管理员' },
    { email: 'librarian@library.com', role: '图书管理员' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = isRegister
        ? await api.register(name, email, password, role)
        : await api.login(email, password)
      login(data.user, data.token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          图书馆管理系统
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          {isRegister && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="reader">读者</option>
              <option value="librarian">图书管理员</option>
              <option value="admin">管理员</option>
            </select>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {isRegister ? '注册' : '登录'}
          </button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setError('') }}
          className="w-full mt-4 text-blue-600 hover:underline"
        >
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </button>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-2">演示账号（密码: 123456）:</p>
          {demoUsers.map((u) => (
            <button
              key={u.email}
              onClick={() => { setEmail(u.email); setPassword('123456') }}
              className="block text-left text-sm text-blue-600 hover:underline w-full"
            >
              {u.role}: {u.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Login
