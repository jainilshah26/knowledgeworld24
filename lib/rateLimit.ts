// Lightweight in-memory rate limiter, keyed by client IP.
//
// This resets whenever a serverless function instance cold-starts and isn't
// shared across regions/instances, so it's a first line of defense against
// naive bot floods rather than a hard guarantee — pair it with the honeypot
// field, and consider a durable store (e.g. Upstash Redis) if abuse persists.

const DEFAULT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const DEFAULT_MAX_REQUESTS = 5

const hits = new Map<string, { count: number; resetAt: number }>()

function cleanup(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export function isRateLimited(
  key: string,
  options?: { windowMs?: number; max?: number }
): boolean {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS
  const max = options?.max ?? DEFAULT_MAX_REQUESTS
  const now = Date.now()
  cleanup(now)

  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > max
}
