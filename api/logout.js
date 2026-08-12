const { clearSession } = require("./_auth");

module.exports = function handler(req, res) {
  clearSession(res);
  res.status(200).json({ ok: true });
};
