const { head, put } = require("@vercel/blob");
const { isAuthenticated } = require("./_auth");
const fallback = require("../public/content.json");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      try {
        const blob = await head("content/site.json");
        const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Could not read published content");
        return res.status(200).json(await response.json());
      } catch {
        // Before the first publish, seed visitors from the bundled content.
        return res.status(200).json(fallback);
      }
    }
    if (req.method === "POST") {
      if (!isAuthenticated(req)) return res.status(401).json({ error: "Please log in again" });
      const value = JSON.stringify(req.body);
      if (value.length > 2_000_000) return res.status(413).json({ error: "Content is too large" });
      await put("content/site.json", value, {
        access: "public",
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 0,
      });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Storage request failed" });
  }
};
