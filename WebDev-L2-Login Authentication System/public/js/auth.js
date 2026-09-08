// Utility function to show alerts
function showAlert(message, type) {
    const alertBox = document.getElementById('alertMsg');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert-msg alert-${type}`;
        alertBox.style.display = 'block';
    }
}

// Check session on dashboard
async function checkSession() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/login.html';
        } else {
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = data.username;
            }
            // Make dashboard visible after checking auth
            document.querySelector('.container').style.display = 'block';
        }
    } catch (err) {
        console.error('Session check failed', err);
        window.location.href = '/login.html';
    }
}

// Redirect if already logged in (for login and register pages)
async function redirectIfLoggedIn() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        if (data.authenticated) {
            window.location.href = '/dashboard.html';
        }
    } catch (err) {
        console.error(err);
    }
}

// Handle Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    redirectIfLoggedIn();
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic frontend validation
        if (!username || !email || !password) {
            return showAlert('All fields are required.', 'error');
        }

        if (password.length < 8 || !/\d/.test(password)) {
            return showAlert('Password must be at least 8 characters and contain at least 1 number.', 'error');
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return showAlert(data.error || 'Registration failed.', 'error');
            }

            showAlert('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);

        } catch (err) {
            showAlert('Something went wrong. Please try again.', 'error');
        }
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    redirectIfLoggedIn();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value;

        if (!identifier || !password) {
            return showAlert('All fields are required.', 'error');
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return showAlert(data.error || 'Invalid credentials.', 'error');
            }

            window.location.href = '/dashboard.html';

        } catch (err) {
            showAlert('Something went wrong. Please try again.', 'error');
        }
    });
}

// Handle Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login.html';
        } catch (err) {
            console.error('Logout failed', err);
        }
    });
}

// If on dashboard, execute checkSession
if (document.getElementById('dashboard-page')) {
    checkSession();
}
