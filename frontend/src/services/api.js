const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  login: (email, password) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, role) => request('/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  getBooks: (search) => request(`/books${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getBook: (id) => request(`/books/${id}`),
  addBook: (book) => request('/books', { method: 'POST', body: JSON.stringify(book) }),
  getUsers: () => request('/users'),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getProfile: () => request('/users/profile'),
}
