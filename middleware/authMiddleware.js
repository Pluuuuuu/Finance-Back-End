//Protects routes by ensuring users are authenticated.
// // middleware/authMiddleware.js
const authenticate = (req, res, next) => {
    const user = req.user; // Assuming user is attached to req after login

    if (!user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    next(); // Proceed to controller
};

module.exports = authenticate;
// Applied to /income and /analysis to ensure only authenticated users can access them.