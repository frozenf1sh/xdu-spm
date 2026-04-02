import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)

  const [newBook, setNewBook] = useState({ title: '', author: '', description: '', isbn: '' })
  const [addingBook, setAddingBook] = useState(false)

  useEffect(() => {
    if (activeTab === 'users') fetchUsers()
    else fetchBooks()
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const toggleUserStatus = async (userId, currentActive) => {
    try {
      const userToUpdate = users.find(u => u.id === userId)
      await api.updateUser(userId, { name: userToUpdate.name, active: !currentActive })
      setUsers(users.map(u => u.id === userId ? { ...u, active: !currentActive } : u))
    } catch (err) {
      console.error('Failed to update user:', err)
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    setAddingBook(true)
    try {
      const book = await api.addBook(newBook)
      setBooks([...books, book])
      setNewBook({ title: '', author: '', description: '', isbn: '' })
    } catch (err) {
      console.error('Failed to add book:', err)
    } finally {
      setAddingBook(false)
    }
  }

  const roleLabel = { reader: '读者', admin: '管理员', librarian: '图书管理员' }
  const statusLabel = { available: '可借阅', checked_out: '已借出' }
  const statusColor = { available: 'bg-green-100 text-green-800', checked_out: 'bg-yellow-100 text-yellow-800' }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">⚙️ 管理员仪表板</h1>
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            用户管理
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'books' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            添加图书
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">用户列表</h2>
            {loading ? (
              <div className="text-center py-8">加载中...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">邮箱</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{u.id}</td>
                        <td className="px-4 py-3 text-gray-800">{u.name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3 text-gray-600">{roleLabel[u.role]}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {u.active ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleUserStatus(u.id, u.active)}
                            className={`px-3 py-1 rounded text-sm ${u.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          >
                            {u.active ? '禁用' : '启用'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">添加新图书</h2>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">书名 *</label>
                  <input
                    type="text"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">作者 *</label>
                  <input
                    type="text"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">描述</label>
                  <textarea
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingBook}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingBook ? '添加中...' : '添加图书'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">图书目录 ({books.length})</h2>
              {loading ? (
                <div className="text-center py-8">加载中...</div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {books.map((book) => (
                    <div key={book.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[book.status]}`}>
                          {statusLabel[book.status]}
                        </span>
                        <span className="text-xs text-gray-400">{book.isbn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
