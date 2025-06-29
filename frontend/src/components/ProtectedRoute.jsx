// frontend/src/components/ProtectedRoute.jsx (CORRIGIDO)
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Importe o contexto diretamente

const ProtectedRoute = ({ children }) => {
  // Use o hook useContext para obter os valores do provedor
  const { isAuthenticated } = useContext(AuthContext);

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (a página de busca/inserção)
  // O uso de `children` é mais flexível que `Outlet` neste caso.
  return children;
};

export default ProtectedRoute;
