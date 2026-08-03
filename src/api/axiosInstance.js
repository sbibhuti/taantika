import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken = null;

const setAccessToken = (token) => {
  accessToken = token;
};

// Attach access token
API.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/refresh"];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route),
  );

  if (accessToken && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Auto refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        setAccessToken(res.data.accessToken);

        original.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return API(original);
      } catch {
        window.location.hash = "#/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export { API, setAccessToken };
