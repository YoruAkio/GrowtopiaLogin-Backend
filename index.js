const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
});

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'html'));
app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    // Logging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Generate CSRF token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Dashboard route
app.all('/player/login/dashboard', (req, res) => {
    try {
        const token = generateToken();
        const tData = {
            csrfToken: token
        };

        if (req.method === 'POST') {
            const { username, password } = req.body;
            if (username && password) {
                return res.redirect('/player/growid/login/validate');
            }
        }

        res.render('dashboard', {
            data: tData,
            tokenPlaceholder: token
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Login validation route
app.post('/player/growid/login/validate', (req, res) => {
    try {
        const { _token, growId, password } = req.body;

        // Input validation
        if (!growId) {
            return res.status(400).json({
                status: 'error',
                message: 'Username is required'
            });
        }

        if (growId.length < 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Username must be at least 2 characters long'
            });
        }

        // For account creation (when password is empty)
        if (!password) {
            // Handle account creation logic here
            const creationToken = Buffer.from(
                `_token=${_token}&growId=${growId}&new=true`
            ).toString('base64');

            return res.json({
                status: 'success',
                message: 'Account Creation Initiated',
                token: creationToken,
                accountType: 'growtopia'
            });
        }

        // For login (when password is provided)
        if (password.length < 7) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 7 characters long'
            });
        }

        const loginToken = Buffer.from(
            `_token=${_token}&growId=${growId}&password=${password}`
        ).toString('base64');

        res.json({
            status: 'success',
            message: 'Account Validated',
            token: loginToken,
            accountType: 'growtopia'
        });

    } catch (error) {
        console.error('Validation Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Redirect route
app.all('/player/*', (req, res) => {
    const path = req.path.slice(8);
    res.redirect(301, `https://api.yoruakio.tech/player/${path}`);
});

// Home route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
