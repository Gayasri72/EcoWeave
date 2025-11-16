import axios from "axios";

// Vite exposes env vars via import.meta.env in the browser. Avoid direct access to
// process.env (not defined in the browser) to prevent runtime ReferenceError.
const envFallback =
  (typeof globalThis !== "undefined" &&
    globalThis["process"] &&
    globalThis["process"].env &&
    globalThis["process"].env.REACT_APP_API_URL) ||
  undefined;
const baseURL =
  import.meta.env.VITE_API_BASE || envFallback || "http://localhost:5000";

const instance = axios.create({ baseURL });

// Add a request interceptor to attach token if present
instance.interceptors.request.use((cfg) => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("ecoweave_token");
    if (token)
      cfg.headers = {
        ...(cfg.headers || {}),
        Authorization: `Bearer ${token}`,
      };
  } catch (e) {
    // ignore
  }
  return cfg;
});

export default instance;
