const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression({
    level: 5,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode}`);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, headers: true }));

// Serve the login page as the main route
app.get('/', function (req, res) {
    res.render(path.join(__dirname, 'public/html/dashboard.ejs'), { tokenPlaceholder: 'your-csrf-token-here' });
});

app.post('/player/growid/login/validate', (req, res) => {
    const _token = req.body._token;
    const growId = req.body.growId;
    const password = req.body.password;

    const token = Buffer.from(
        `_token=${_token}&growId=${growId}&password=${password}`,
    ).toString('base64');

    res.json({
        status: "success",
        message: "Account Validated.",
        token: token,
        url: "",
        accountType: "growtopia"
    });
});

app.all('/player/login/dashboard', function (req, res) {
    const tData = {};
    try {
        if (req.body && typeof req.body === 'string') {
            const uData = req.body.split('\n');
            uData.forEach(line => {
                const [key, value] = line.split('|');
                if (key && value) {
                    tData[key] = value;
                }
            });
        }
    } catch (why) {
        console.log(`Warning: ${why}`);
    }

    res.render(path.join(__dirname, 'public/html/dashboard.ejs'), { 
        data: tData,
        tokenPlaceholder: 'your-csrf-token-here'
    });
});

app.all('/player/*', function (req, res) {
    res.status(301).redirect('https://api.yoruakio.tech/player/' + req.path.slice(8));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
