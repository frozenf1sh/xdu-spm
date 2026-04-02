import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import BookDetail from '../components/BookDetail'
import ProfileModal from '../components/ProfileModal'

const ReaderDashboard = () => {
  const { user, logout, updateUser } = useAuth()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async (searchQuery = '') => {
    setLoading(true)
    try {
      const data = await api.getBooks(searchQuery)
      setBooks(data)
    } catch (err) {
      console.error('Failed to fetch books:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks(search)
  }

  const statusLabel = { available: '可借阅', checked_out: '已借出' }
  const statusColor = { available: 'bg-green-100 text-green-800', checked_out: 'bg-yellow-100 text-yellow-800' }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📚 读者仪表板</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎，{user?.name}</span>
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              个人资料
            </button>
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
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="搜索书名或作者..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              搜索
            </button>
            <button
              type="button"
              onClick={() => { setSearch(''); fetchBooks('') }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              重置
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-3">作者：{book.author}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[book.status]}`}>
                    {statusLabel[book.status]}
                  </span>
                  <span className="text-xs text-gray-400">ISBN: {book.isbn}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-12 text-gray-500">未找到图书</div>
        )}
      </main>

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={updateUser} />
      )}
    </div>
  )
}

export default ReaderDashboard
