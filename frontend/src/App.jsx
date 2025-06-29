// frontend/src/App.jsx
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import { AuthContext, AuthProvider } from "./contexts/AuthContext"; // Importe o AuthContext E o AuthProvider
import { VehicleProvider } from "./contexts/VehicleContext";

import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SelectBrand from "./components/SelectBrand";
import SelectModel from "./components/SelectModel";
import SelectYear from "./components/SelectYear";
import VehicleResult from "./components/VehicleResult";
import VehicleForm from "./components/VehicleForm";

import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
} from "@mui/material";

// Componente para a Barra de Navegação
// Como ele está FORA do componente App principal, ele será renderizado como 'filho' do AuthProvider,
// o que permite o uso seguro do useContext.
const NavigationBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FIPE
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Busca
        </Button>
        <Button color="inherit" component={RouterLink} to="/insert">
          Inserir
        </Button>
        {isAuthenticated && (
          <Button color="inherit" onClick={logout}>
            Sair
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Página principal de busca de veículos
const SearchPage = () => (
  <Box sx={{ my: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Consulta Tabela FIPE
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SelectBrand />
      <SelectModel />
      <SelectYear />
    </Box>
    <VehicleResult />
  </Box>
);

function App() {
  return (
    // 1. O Router envolve tudo
    <Router basename="/FipeApi">
      {/* 2. O AuthProvider envolve os componentes que precisam de autenticação */}
      <AuthProvider>
        {/* 3. O VehicleProvider envolve os componentes que precisam do estado do veículo */}
        <VehicleProvider>
          {/* Usamos o componente NavigationBar aqui */}
          <NavigationBar />

          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insert"
                element={
                  <ProtectedRoute>
                    <VehicleForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </VehicleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
