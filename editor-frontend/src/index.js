import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ContextProvider } from "./contexts/contextProvider";

import PrintProvider from "react-easy-print";
import { DraggableProvider } from "./contexts/DraggableContext";
import ThankYouPage from "./utils/redirectPages/ThankYouPage";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <PrintProvider>
      <DraggableProvider>
        {/* <React.StrictMode> */}
          <Router>
            <App/>
          </Router>
        {/* </React.StrictMode> */}
      </DraggableProvider>
    </PrintProvider>
  </ContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();