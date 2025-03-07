//Catches and handles errors.
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
};

module.exports = errorHandler;

//Applied at the end of server.js to catch errors from all routes.

