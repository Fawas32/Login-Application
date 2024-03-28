// app.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.sqlite');

// Create users table if not exists
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

  // Insert sample users if the table is empty
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
      stmt.run("user1", "password1");
      stmt.run("user2", "password2");
      stmt.finalize();
    }
  });
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve HTML file for login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle login POST request
app.post('/login', (req, res) => {
    const username = req.body.username; // Vulnerable to Reflected XSS
    const password = req.body.password;

    const sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    db.all(sql, (err, rows) => {
        if (err) {
            res.send('Error occurred');
            return;
        }
        if (rows.length > 0) {
            // Redirect to login.html after successful login
            res.redirect('/login.html');
        } else {
            res.send('Invalid username or password');
        }
    });
});

// Serve login.html page
app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Vulnerable to Stored XSS
const comments = [];

app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  comments.push(comment);
  res.send('Comment added successfully!');
});

app.get('/comments', (req, res) => {
  let commentList = '';
  comments.forEach((comment, index) => {
    commentList += `<li>${index + 1}: ${comment}</li>`;
  });
  res.send(`<ul>${commentList}</ul>`);
});

// Vulnerable to DOM-based XSS
app.get('/dom-xss', (req, res) => {
  const username = req.query.username; // Read from URL query parameters
  res.send(`<script>alert('Hello, ${username}!')</script>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
