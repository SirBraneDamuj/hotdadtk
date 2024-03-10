import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";
import "./index.css";

Modal.setAppElement("#root");
Modal.defaultStyles = {
  content: {
    ...Modal.defaultStyles.content,
    color: "#FAFAFA",
    backgroundColor: "#363636",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
