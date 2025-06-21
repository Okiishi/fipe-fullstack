import { useContext, useEffect } from "react";
import { VehicleContext } from "../contexts/VehicleContext";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import api from "../api";

const SelectYear = () => {
  const { state, dispatch } = useContext(VehicleContext);

  useEffect(() => {
    if (state.selectedBrand && state.selectedModel) {
      // Altera a chamada para usar o backend
      api
        .get(
          `/fipe/anos/${state.vehicleType}/${state.selectedBrand}/${state.selectedModel}`
        )
        .then((res) => dispatch({ type: "SET_YEARS", payload: res.data }))
        .catch((err) => console.error("Erro ao buscar anos:", err));
    }
  }, [state.selectedBrand, state.selectedModel]);

  const handleChange = (e) => {
    dispatch({ type: "SET_SELECTED_YEAR", payload: e.target.value });
  };

  return (
    <FormControl fullWidth margin="normal" disabled={!state.selectedModel}>
      <InputLabel>Ano</InputLabel>
      <Select value={state.selectedYear} onChange={handleChange} label="Ano">
        {state.years.map((year) => (
          <MenuItem key={year.codigo} value={year.codigo}>
            {year.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectYear;
