import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importe o BrowserRouter
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* O Router fica aqui, no topo, com a configuração de caminho */}
      <BrowserRouter basename="/FipeApi">
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
