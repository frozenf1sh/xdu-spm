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

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

app.post('/api/register', (req, res) => {
  try {
    const { name, email, password, role = 'reader' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          console.error('Registration error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        const token = jwt.sign({ userId: this.lastID, email, role }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, name, email, role } });
      });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.active) {
        return res.status(403).json({ error: 'Account disabled' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/books', (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM Books';
    let params = [];

    if (search) {
      query += ' WHERE title LIKE ? OR author LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    db.all(query, params, (err, books) => {
      if (err) {
        console.error('Get books error:', err);
        return res.status(500).json({ error: 'Failed to fetch books' });
      }
      res.json(books || []);
    });
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', (req, res) => {
  try {
    db.get('SELECT * FROM Books WHERE id = ?', [req.params.id], (err, book) => {
      if (err) {
        console.error('Get book error:', err);
        return res.status(500).json({ error: 'Failed to fetch book' });
      }
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    });
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

app.post('/api/books', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.sendStatus(403);
    }

    const { title, author, description, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    db.run('INSERT INTO Books (title, author, description, isbn, status) VALUES (?, ?, ?, ?, ?)',
      [title, author, description, isbn, 'available'],
      function(err) {
        if (err) {
          console.error('Add book error:', err);
          return res.status(500).json({ error: 'Failed to add book' });
        }
        res.json({ id: this.lastID, title, author, description, isbn, status: 'available' });
      });
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.get('/api/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.sendStatus(403);
    }

    db.all('SELECT id, name, email, role, active FROM Users', [], (err, users) => {
      if (err) {
        console.error('Get users error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json(users || []);
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
      return res.sendStatus(403);
    }

    const { name, active } = req.body;

    if (req.user.role === 'admin' && active !== undefined) {
      db.run('UPDATE Users SET name = ?, active = ? WHERE id = ?',
        [name, active ? 1 : 0, req.params.id],
        function(err) {
          if (err) {
            console.error('Update user error:', err);
            return res.status(500).json({ error: 'Failed to update user' });
          }
          res.json({ message: 'User updated' });
        });
    } else {
      db.run('UPDATE Users SET name = ? WHERE id = ?',
        [name, req.params.id],
        function(err) {
          if (err) {
            console.error('Update user error:', err);
            return res.status(500).json({ error: 'Failed to update user' });
          }
          res.json({ message: 'User updated' });
        });
    }
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/users/profile', authenticateToken, (req, res) => {
  try {
    db.get('SELECT id, name, email, role FROM Users WHERE id = ?', [req.user.userId], (err, user) => {
      if (err) {
        console.error('Get profile error:', err);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Health check: http://localhost:3001/api/health');
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

startServer();
