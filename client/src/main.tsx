import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.css";
import "./styles/tailwind.css";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
