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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<FipePage />} />
      </Route>
    </Routes>
  );
}

export default App;
