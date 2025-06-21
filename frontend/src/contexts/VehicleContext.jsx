import { createContext, useReducer } from "react";

export const VehicleContext = createContext();

const initialState = {
  vehicleType: "carros",
  brands: [],
  selectedBrand: "",
  models: [],
  selectedModel: "",
  years: [],
  selectedYear: "",
  result: null,
  loading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VEHICLE_TYPE":
      return {
        ...state,
        vehicleType: action.payload,
        selectedBrand: "",
        selectedModel: "",
        selectedYear: "",
        result: null,
      };
    case "SET_BRANDS":
      return { ...state, brands: action.payload };
    case "SET_SELECTED_BRAND":
      return {
        ...state,
        selectedBrand: action.payload,
        selectedModel: "",
        selectedYear: "",
        result: null,
      };
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_SELECTED_MODEL":
      return {
        ...state,
        selectedModel: action.payload,
        selectedYear: "",
        result: null,
      };
    case "SET_YEARS":
      return { ...state, years: action.payload };
    case "SET_SELECTED_YEAR":
      return { ...state, selectedYear: action.payload };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <VehicleContext.Provider value={{ state, dispatch }}>
      {children}
    </VehicleContext.Provider>
  );
};
