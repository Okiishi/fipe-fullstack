import { useContext } from "react";
import { VehicleContext } from "../contexts/VehicleContext";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../api";

const VehicleResult = () => {
  const { state, dispatch } = useContext(VehicleContext);

  const handleSearch = async () => {
    dispatch({ type: "SET_ERROR", payload: "" });

    if (!state.selectedBrand || !state.selectedModel || !state.selectedYear) {
      dispatch({
        type: "SET_ERROR",
        payload: "Preencha todos os campos antes de consultar.",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Altera a chamada para usar o backend
      const res = await api.get(
        `/fipe/valor/${state.vehicleType}/${state.selectedBrand}/${state.selectedModel}/${state.selectedYear}`
      );
      dispatch({ type: "SET_RESULT", payload: res.data });
    } catch (err) {
      // Exibe o erro vindo do backend
      const errorMessage =
        err.response?.data?.message || "Erro ao consultar a API.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSearch}
          disabled={state.loading}
        >
          {state.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Consultar Valor"
          )}
        </Button>
      </Box>

      {state.error && (
        <Box mt={2}>
          <Alert severity="error">{state.error}</Alert>
        </Box>
      )}

      {state.result && !state.loading && (
        <Box mt={3} p={3} bgcolor="#ffffff" borderRadius={2} boxShadow={2}>
          <Typography variant="h6" gutterBottom>
            {state.result.Modelo}
          </Typography>
          <Typography>Marca: {state.result.Marca}</Typography>
          <Typography>Ano Modelo: {state.result.AnoModelo}</Typography>
          <Typography>Combustível: {state.result.Combustivel}</Typography>
          <Typography fontWeight="bold">Valor: {state.result.Valor}</Typography>
        </Box>
      )}
    </>
  );
};

export default VehicleResult;
