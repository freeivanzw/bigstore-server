const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'token is not available'
      })
    }
    const isValid = jwt.verify(token, process.env.JWT_KEY);

    if (isValid) {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'token not valid'
      })
    }
  } catch (e) {
    return res.status(403).json({
      success: false,
      message: e.message
    })
  }

}

module.exports = authMiddleware;