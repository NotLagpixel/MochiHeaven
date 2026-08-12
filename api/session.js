const { isAuthenticated } = require("./_auth");

module.exports = function handler(req, res) {
  res.status(200).json({ authenticated: isAuthenticated(req) });
};
