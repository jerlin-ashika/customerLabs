import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Inter, sans-serif",
              colorPrimary: "#11bf9cff",
            },
          }}
        >
          <App />
        </ConfigProvider>
      </BrowserRouter>
  </StrictMode>
);
