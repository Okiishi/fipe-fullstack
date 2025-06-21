import React, { useState, useContext } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { insertVehicle } from "../api";

const VehicleForm = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    value: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validação simples no front-end
    if (
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.value
    ) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const response = await insertVehicle(formData, token);
      setSuccess(
        `Veículo "${response.data.brand} ${response.data.model}" inserido com sucesso!`
      );
      // Limpa o formulário após o sucesso
      setFormData({
        brand: "",
        model: "",
        year: "",
        value: "",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data ||
        "Erro ao inserir veículo.";
      setError(errorMsg);
      setSuccess("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 4,
        p: 2,
        border: "1px solid grey",
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" component="h2">
        Inserir Novo Veículo
      </Typography>
      <TextField
        label="Marca"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Modelo"
        name="model"
        value={formData.model}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Ano"
        name="year"
        type="number"
        value={formData.year}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Valor (Ex: R$ 25.000,00)"
        name="value"
        value={formData.value}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Inserir Veículo
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
    </Box>
  );
};

export default VehicleForm;
