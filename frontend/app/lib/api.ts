const BASE_URL = "http://127.0.0.1:8000";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }
};

export async function authFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    clearAuth();
  }

  return res;
}

export async function getEmployees() {
  const res = await authFetch(`${BASE_URL}/employees/`);
  return res.json();
}

// Jobs
export async function getJobs() {
  const res = await authFetch(`${BASE_URL}/jobs/`);
  return res.json();
}

// Candidates
export async function getCandidates() {
  const res = await authFetch(`${BASE_URL}/candidates/`);
  return res.json();
}