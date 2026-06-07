const parseToken = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload;
  } catch (err) {
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getUserRole = () => {
  if (typeof window === "undefined") return null;

  const token = getToken();
  const payload = parseToken(token);
  if (!payload) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return null;

  return payload.role || null;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = getToken();
  const payload = parseToken(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return false;

  return true;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }
};