const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'library-secret-key-2024';

app.use(cors());
app.use(bodyParser.json());

initDatabase();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/register', (req, res) => {
  const { name, email, password, role = 'reader' } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role],
    function(err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      const token = jwt.sign({ userId: this.lastID, email, role }, JWT_SECRET);
      res.json({ token, user: { id: this.lastID, name, email, role } });
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.active) return res.status(403).json({ error: 'Account disabled' });

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.get('/api/books', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM Books';
  let params = [];

  if (search) {
    query += ' WHERE title LIKE ? OR author LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  db.all(query, params, (err, books) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(books);
  });
});

app.get('/api/books/:id', (req, res) => {
  db.get('SELECT * FROM Books WHERE id = ?', [req.params.id], (err, book) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  });
});

app.post('/api/books', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const { title, author, description, isbn } = req.body;

  db.run('INSERT INTO Books (title, author, description, isbn, status) VALUES (?, ?, ?, ?, ?)',
    [title, author, description, isbn, 'available'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, author, description, isbn, status: 'available' });
    });
});

app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  db.all('SELECT id, name, email, role, active FROM Users', [], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
    return res.sendStatus(403);
  }

  const { name, active } = req.body;

  if (req.user.role === 'admin' && active !== undefined) {
    db.run('UPDATE Users SET name = ?, active = ? WHERE id = ?',
      [name, active ? 1 : 0, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
      });
  } else {
    db.run('UPDATE Users SET name = ? WHERE id = ?',
      [name, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
      });
  }
});

app.get('/api/users/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, role FROM Users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
