import { useContext, useEffect } from "react";
import { VehicleContext } from "../contexts/VehicleContext";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import api from "../api";

const SelectBrand = () => {
  const { state, dispatch } = useContext(VehicleContext);

  useEffect(() => {
    api
      .get(`/fipe/marcas/${state.vehicleType}`)
      .then((res) => dispatch({ type: "SET_BRANDS", payload: res.data }))
      .catch((err) => console.error("Erro ao buscar marcas:", err));
  }, [state.vehicleType]);

  const handleChange = (e) => {
    dispatch({ type: "SET_SELECTED_BRAND", payload: e.target.value });
  };

  return (
    <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
      <InputLabel>Marca</InputLabel>
      <Select value={state.selectedBrand} onChange={handleChange} label="Marca">
        {state.brands.map((brand) => (
          <MenuItem key={brand.codigo} value={brand.codigo}>
            {brand.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectBrand;
