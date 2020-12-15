const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function will take three things, req, res, next
// A function that has access to req/res cycle/objects
// next is a callback that runs to move onto next middleware

module.exports = function (req, res, next) {
  // Get token from header
  // when a req is sent to protected route, token is sent in the header
  const token = req.header('x-auth-token');

  // Check to see if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // now take request object and assign a value to user
    req.user = decoded.user;
    // Now req.user may access protected routes (profile etc.)
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
