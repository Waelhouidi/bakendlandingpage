// middleware/session.js
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
      next();
  } else {
      res.status(401).json({ message: "Unauthorized: Please log in" });
  }
};

const validateSession = (req, res, next) => {
  try {
    // Verify session structure
    if (!req.session?.user?.role) {
      return res.status(401).json({ 
        code: 'SESSION_INVALID',
        message: 'Session expired or invalid' 
      });
    }
    
    // Verify admin privileges
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({
        code: 'ACCESS_DENIED',
        message: 'Requires admin privileges'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      code: 'SESSION_ERROR',
      message: 'Session validation failed' 
    });
  }
};

module.exports = {
  isAuthenticated,
  validateSession
};