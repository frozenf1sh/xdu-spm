const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbDir = process.env.DB_DIR || __dirname;
const dbPath = path.join(dbDir, 'library.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('reader', 'admin', 'librarian')),
        active INTEGER DEFAULT 1
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        isbn TEXT UNIQUE,
        status TEXT DEFAULT 'available' CHECK(status IN ('available', 'checked_out'))
      )`);

      const salt = bcrypt.genSaltSync(10);
      const users = [
        { name: '张三 Reader', email: 'reader@library.com', password: bcrypt.hashSync('123456', salt), role: 'reader' },
        { name: '李四 Admin', email: 'admin@library.com', password: bcrypt.hashSync('123456', salt), role: 'admin' },
        { name: '王五 Librarian', email: 'librarian@library.com', password: bcrypt.hashSync('123456', salt), role: 'librarian' }
      ];

      const books = [
        { title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', description: '深入理解JavaScript的核心概念', isbn: '978-7-115-27579-0', status: 'available' },
        { title: '代码整洁之道', author: 'Robert C. Martin', description: '软件工程的实践指南', isbn: '978-7-115-21687-8', status: 'available' },
        { title: '设计模式：可复用面向对象软件的基础', author: 'Gang of Four', description: '经典设计模式著作', isbn: '978-7-111-07575-2', status: 'checked_out' },
        { title: '深入理解计算机系统', author: 'Randal E. Bryant', description: '计算机系统原理', isbn: '978-7-111-54493-7', status: 'available' },
        { title: '算法导论', author: 'Thomas H. Cormen', description: '算法领域经典教材', isbn: '978-7-111-40701-0', status: 'available' },
        { title: '人月神话', author: 'Frederick P. Brooks', description: '软件工程随笔', isbn: '978-7-302-15546-9', status: 'checked_out' },
        { title: '重构：改善既有代码的设计', author: 'Martin Fowler', description: '代码重构技术', isbn: '978-7-115-50864-5', status: 'available' },
        { title: '程序员修炼之道', author: 'Andrew Hunt', description: '从工匠到大师的修行之路', isbn: '978-7-121-19588-4', status: 'available' },
        { title: '领域驱动设计', author: 'Eric Evans', description: '软件核心复杂性应对之道', isbn: '978-7-115-36349-7', status: 'available' },
        { title: '测试驱动开发', author: 'Kent Beck', description: 'TDD实战指南', isbn: '978-7-5083-4395-0', status: 'available' }
      ];

      let completed = 0;
      const total = users.length + books.length;

      const checkDone = () => {
        completed++;
        if (completed >= total) {
          console.log('Database initialized with mock data');
          resolve();
        }
      };

      users.forEach(user => {
        db.run('INSERT OR IGNORE INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [user.name, user.email, user.password, user.role], checkDone);
      });

      books.forEach(book => {
        db.run('INSERT OR IGNORE INTO Books (title, author, description, isbn, status) VALUES (?, ?, ?, ?, ?)',
          [book.title, book.author, book.description, book.isbn, book.status], checkDone);
      });
    });
  });
}

module.exports = { db, initDatabase };
