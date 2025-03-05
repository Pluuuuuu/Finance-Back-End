// Logs each request.
// middleware/logger.js
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Pass to the next function
};

module.exports = logger;

//Usage: Applied to all routes to log request details.