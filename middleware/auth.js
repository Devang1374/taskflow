const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user id to request
    req.userId = decoded.id;

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};