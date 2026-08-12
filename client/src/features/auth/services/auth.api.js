const api = (path, { method = "GET", body, token } = {}) => {
  const opts = { method, headers: {} };
  if (body != null) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }
  return fetch(path, opts)
    .catch((e) => {
      const err = new Error(
        `Cannot reach the API server at ${path}. Is \`npm run dev:server\` running?`
      );
      err.network = true;
      err.cause = e;
      throw err;
    })
    .then(async (r) => {
      const text = await r.text();
      let parsed;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = null;
      }
      if (!r.ok) {
        const err = new Error(parsed?.error || r.statusText);
        err.status = r.status;
        err.detail = parsed;
        throw err;
      }
      return parsed;
    });
};

/** Exchange email + password for a session token + admin record. */
export function login(email, password) {
  return api("/api/auth/login", { method: "POST", body: { email, password } });
}

/** Invalidate the current session token server-side. */
export function logout(token) {
  return api("/api/auth/logout", { method: "POST", token });
}

/** Validate a session token and fetch the current admin record. */
export function me(token) {
  return api("/api/auth/me", { token });
}

/** Request a password reset link for the given email (never reveals if it exists). */
export function forgotPassword(email) {
  return api("/api/auth/forgot-password", { method: "POST", body: { email } });
}

/** Consume a reset token and set a new password. */
export function resetPassword(token, password) {
  return api("/api/auth/reset-password", { method: "POST", body: { token, password } });
}
