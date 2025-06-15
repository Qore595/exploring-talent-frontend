// This is a mock authentication middleware for development purposes
// It bypasses the JWT verification for easier testing

exports.authenticate = (req, res, next) => {
  // Add a mock user to the request
  req.user = {
    id: 1,
    email: 'admin@example.com',
    role: 'admin'
  };
  
  // Continue to the next middleware or route handler
  next();
};
