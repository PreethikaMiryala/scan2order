export function decodeJwt(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
}

export function isJwtExpired(token, skewSeconds = 30) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

export function getJwtExpiry(token) {
  const payload = decodeJwt(token);
  return payload?.exp ? payload.exp * 1000 : null;
}
