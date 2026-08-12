/**
 * Minimal in-memory fixed-window rate limiter — no extra dependency needed
 * for a single-process internal admin tool. Keyed by IP + route, resets
 * automatically after `windowMs`.
 *
 * Not suitable for a multi-process/horizontally scaled deployment (each
 * process has its own counters); swap for a shared store (Redis) if this
 * ever runs behind more than one server instance.
 */
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map(); // key -> { count, resetAt }

  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: message || "Too many requests. Please try again later.",
      });
    }

    entry.count += 1;
    next();
  };
}
