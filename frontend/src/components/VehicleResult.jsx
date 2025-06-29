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
    dispatch({ type: "SET_RESULT", payload: null });

    try {
      const res = await api.get(
        `/fipe/valor/${state.vehicleType}/${state.selectedBrand}/${state.selectedModel}/${state.selectedYear}`
      );
      dispatch({ type: "SET_RESULT", payload: res.data });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Erro ao consultar o veículo.";
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
        <Box mt={3} p={3} bgcolor="#ffffff" borderRadius={2} boxShadow={3}>
          <Typography variant="h6" component="div" gutterBottom>
            {state.result.Modelo}
          </Typography>
          <Typography>Marca : {state.result.Marca}</Typography>
          <Typography>Ano : {state.result.AnoModelo}</Typography>
          <Typography fontWeight="bold" sx={{ mt: 1 }}>
            Valor: {state.result.Valor}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default VehicleResult;
