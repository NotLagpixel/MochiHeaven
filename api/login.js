const { safeEqual, secret, setSession } = require("./_auth");

module.exports = function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    if (!safeEqual(req.body?.password || "", secret())) return res.status(401).json({ error: "Incorrect password" });
    setSession(res);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
