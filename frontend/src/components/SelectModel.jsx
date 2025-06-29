import { useContext, useEffect } from "react";
import { VehicleContext } from "../contexts/VehicleContext";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import api from "../api";

const SelectModel = () => {
  const { state, dispatch } = useContext(VehicleContext);

  useEffect(() => {
    if (state.selectedBrand) {
      api
        .get(`/fipe/modelos/${state.vehicleType}/${state.selectedBrand}`)
        .then((res) =>
          dispatch({ type: "SET_MODELS", payload: res.data.modelos })
        )
        .catch((err) => console.error("Erro ao buscar modelos:", err));
    }
  }, [state.vehicleType, state.selectedBrand]);

  const handleChange = (e) => {
    dispatch({ type: "SET_SELECTED_MODEL", payload: e.target.value });
  };

  return (
    <FormControl
      fullWidth
      margin="normal"
      sx={{ mb: 2 }}
      disabled={!state.selectedBrand}
    >
      <InputLabel>Modelo</InputLabel>
      <Select
        value={state.selectedModel}
        onChange={handleChange}
        label="Modelo"
      >
        {state.models.map((model) => (
          <MenuItem key={model.codigo} value={model.codigo}>
            {model.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectModel;
