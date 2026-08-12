const crypto = require("crypto");

const COOKIE = "mochi_admin_session";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  if (!process.env.ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD is not configured");
  return process.env.ADMIN_PASSWORD;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function signature(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function makeToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((part) => {
    const i = part.indexOf("=");
    return [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1))];
  }));
}

function isAuthenticated(req) {
  try {
    const token = cookies(req)[COOKIE] || "";
    const [payload, sig] = token.split(".");
    if (!payload || !sig || !safeEqual(sig, signature(payload))) return false;
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

function setSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=${makeToken()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`);
}

function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

module.exports = { clearSession, isAuthenticated, safeEqual, secret, setSession };
