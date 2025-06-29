// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de REQUISIÇÃO: adiciona o token a cada chamada
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

// --- NOVO INTERCEPTOR DE RESPOSTA ---
// Lida com erros globais, especialmente o de token expirado (401)
api.interceptors.response.use(
  // Se a resposta for bem-sucedida, apenas a retorna
  (response) => response,
  // Se houver um erro...
  (error) => {
    // Verifica se o erro é uma resposta da API com status 401
    if (error.response && error.response.status === 401) {
      // 1. Limpa o token expirado do localStorage
      localStorage.removeItem("token");
      // 2. Remove o cabeçalho de autorização das futuras requisições do axios
      delete api.defaults.headers.common["Authorization"];
      // 3. Redireciona o usuário para a página de login
      // Usamos window.location para forçar um recarregamento completo, limpando qualquer estado do React.
      // Adicione o `basename` se ele não for o root.
      window.location.href = "/FipeApi/login";

      // Opcional: mostrar uma mensagem
      alert("Sua sessão expirou. Por favor, faça login novamente.");
    }
    // Rejeita a promessa para que o .catch() no local da chamada (ex: SelectBrand) ainda possa ser acionado se necessário.
    return Promise.reject(error);
  }
);

export const insertVehicle = (vehicleData) => {
  // A lógica do token já é tratada pelo interceptor, então não precisa passar o token aqui
  return api.post("/fipe/vehicles", vehicleData);
};

export default api;
