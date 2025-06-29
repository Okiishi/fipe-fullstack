import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");

      delete api.defaults.headers.common["Authorization"];

      window.location.href = "/FipeApi/login";

      alert("Sua sessão expirou. Por favor, faça login novamente.");
    }

    return Promise.reject(error);
  }
);

export const insertVehicle = (vehicleData) => {
  return api.post("/fipe/vehicles", vehicleData);
};

export default api;
