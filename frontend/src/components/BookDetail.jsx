import React from 'react'

const BookDetail = ({ book, onClose }) => {
  const statusLabel = { available: '可借阅', checked_out: '已借出' }
  const statusColor = { available: 'bg-green-100 text-green-800', checked_out: 'bg-yellow-100 text-yellow-800' }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-gray-500 text-sm">作者</span>
              <p className="text-gray-800 font-medium">{book.author}</p>
            </div>

            <div>
              <span className="text-gray-500 text-sm">ISBN</span>
              <p className="text-gray-800 font-mono">{book.isbn}</p>
            </div>

            <div>
              <span className="text-gray-500 text-sm">状态</span>
              <p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${statusColor[book.status]}`}>
                  {statusLabel[book.status]}
                </span>
              </p>
            </div>

            <div>
              <span className="text-gray-500 text-sm">描述</span>
              <p className="text-gray-700 mt-1 leading-relaxed">{book.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
