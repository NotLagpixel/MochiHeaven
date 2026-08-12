const { put } = require("@vercel/blob");
const { isAuthenticated } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Please log in again" });
  try {
    const { dataUrl, name = "image" } = req.body || {};
    const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(dataUrl || "");
    if (!match) return res.status(400).json({ error: "Unsupported image format" });
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > 3_000_000) return res.status(413).json({ error: "Image must be under 3 MB" });
    const ext = match[1].split("/")[1].replace("jpeg", "jpg");
    const safeName = name.replace(/[^a-z0-9_-]/gi, "-").slice(0, 60) || "image";
    const blob = await put(`uploads/${safeName}.${ext}`, bytes, {
      access: "public",
      addRandomSuffix: true,
      contentType: match[1],
    });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
};
