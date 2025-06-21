// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { VehicleProvider } from "./contexts/VehicleContext";
import SelectBrand from "./components/SelectBrand";
import SelectModel from "./components/SelectModel";
import SelectYear from "./components/SelectYear";
import VehicleResult from "./components/VehicleResult";
import { Container, Typography } from "@mui/material";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import VehicleForm from "./components/VehicleForm";

// Componente para a página de consulta FIPE
const FipePage = () => (
  <VehicleProvider>
    <Container
      maxWidth="sm"
      sx={{ mt: 4, p: 4, bgcolor: "#f9f9f9", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Consulta Tabela FIPE
      </Typography>
      <SelectBrand />
      <SelectModel />
      <SelectYear />
      <VehicleResult />
    </Container>
  </VehicleProvider>
);

function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Consulta Tabela FIPE
              </Typography>
              {/* 2. Adicione um link para a nova rota */}
              <Button color="inherit" component={RouterLink} to="/">
                Busca
              </Button>
              <Button color="inherit" component={RouterLink} to="/insert">
                Inserir
              </Button>
            </Toolbar>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Box sx={{ my: 4 }}>
                      <Typography variant="h4" component="h1" gutterBottom>
                        Busca de Veículos
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <SelectBrand />
                        <SelectModel />
                        <SelectYear />
                      </Box>
                      <VehicleResult />
                    </Box>
                  </ProtectedRoute>
                }
              />
              {/* 3. Crie a nova rota protegida para o formulário */}
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
        </Router>
      </VehicleProvider>
    </AuthProvider>
  );
}

export default App;
