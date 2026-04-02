import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const LibrarianDashboard = () => {
  const { user, logout } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const data = await api.getBooks()
      setBooks(data)
    } catch (err) {
      console.error('Failed to fetch books:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesStatus = filter === 'all' || book.status === filter
    const matchesSearch = !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusLabel = { available: '可借阅', checked_out: '已借出' }
  const statusColor = { available: 'bg-green-100 text-green-800', checked_out: 'bg-yellow-100 text-yellow-800' }

  const stats = {
    total: books.length,
    available: books.filter((b) => b.status === 'available').length,
    checkedOut: books.filter((b) => b.status === 'checked_out').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📖 图书管理员仪表板</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎，{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">图书总数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">可借阅</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">📖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">已借出</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.checkedOut}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <h2 className="text-lg font-semibold">图书目录管理</h2>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="搜索书名或作者..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="available">可借阅</option>
                <option value="checked_out">已借出</option>
              </select>
              <button
                onClick={fetchBooks}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                刷新
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">书名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">作者</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ISBN</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">描述</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{book.id}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{book.title}</td>
                      <td className="px-4 py-3 text-gray-600">{book.author}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-sm">{book.isbn}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[book.status]}`}>
                          {statusLabel[book.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm max-w-xs truncate">{book.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12 text-gray-500">没有找到符合条件的图书</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LibrarianDashboard
