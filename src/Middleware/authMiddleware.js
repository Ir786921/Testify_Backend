const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach the user ID to the request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token!' });
  }
};

module.exports = authenticateUser;
