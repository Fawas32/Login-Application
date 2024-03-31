const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { sanitize } = require('sanitizer');

const app = express();
const db = new sqlite3.Database('database.sqlite');

// Create users table if not exists
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

  
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

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Serve HTML file for login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle login POST request
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Sanitize input to prevent XSS
    username = sanitize(username);
    password = sanitize(password);

    const sql = `SELECT * FROM users WHERE username=? AND password=?`;
    
    db.all(sql, [username, password], (err, rows) => {
        if (err) {
            res.send('Error occurred');
            return;
        }
        if (rows.length > 0) {
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

// Prevent stored XSS by escaping comment input
const comments = [];

app.post('/comment', (req, res) => {
  let comment = req.body.comment;
  
  // Sanitize comment input
  comment = sanitize(comment);
  
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

// Prevent DOM-based XSS by sanitizing output
app.get('/dom-xss', (req, res) => {
  let username = req.query.username;
  username = sanitize(username); // Sanitize username
  res.send(`<script>alert('Hello, ${username}!')</script>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
