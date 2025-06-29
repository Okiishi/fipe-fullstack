import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import { AuthContext, AuthProvider } from "./contexts/AuthContext";
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
    <Router basename="/FipeApi">
      {}
      <AuthProvider>
        {}
        <VehicleProvider>
          {}
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
