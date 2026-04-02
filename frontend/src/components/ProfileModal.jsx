import React, { useState } from 'react'
import { api } from '../services/api'

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess('')
    try {
      await api.updateUser(user.id, { name })
      onUpdate({ name })
      setSuccess('个人资料更新成功！')
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const roleLabel = { reader: '读者', admin: '管理员', librarian: '图书管理员' }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">个人资料</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">用户ID</label>
              <p className="text-gray-800 font-mono">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">角色</label>
              <p className="text-gray-800">{roleLabel[user.role]}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">邮箱</label>
              <p className="text-gray-800">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存修改'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                关闭
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
