const blacklist = new Map(); // token -> expiry (unix seconds)

// Add a token to blacklist. `exp` should be the token expiry (seconds since epoch).
export function addToBlacklist(token, exp) {
  if (!token) return;
  const expiry = typeof exp === "number" ? exp : 0;
  blacklist.set(token, expiry);
}

export function isBlacklisted(token) {
  if (!token) return false;
  const entry = blacklist.get(token);
  if (!entry) return false;
  const now = Math.floor(Date.now() / 1000);
  if (entry <= now) {
    // expired, remove it
    blacklist.delete(token);
    return false;
  }
  return true;
}

// Periodic cleanup of expired entries to avoid unbounded memory growth
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const [token, exp] of blacklist.entries()) {
    if (exp <= now) blacklist.delete(token);
  }
}, 1000 * 60 * 10); // every 10 minutes

export default { addToBlacklist, isBlacklisted };
