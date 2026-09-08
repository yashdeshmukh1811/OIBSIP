const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: 'my-super-secret-key-123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Database Setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err);
            }
        });
    }
});

// Authentication Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Server-side validation for password
    if (password.length < 8 || !/\d/.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters and contain at least 1 number.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
        [username, email, hashedPassword], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or Email already exists.' });
                }
                return res.status(500).json({ error: 'Internal server error.' });
            }
            res.status(201).json({ message: 'Registration successful!' });
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [identifier, identifier], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ message: 'Login successful!' });
    });
});

// Check Session
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
