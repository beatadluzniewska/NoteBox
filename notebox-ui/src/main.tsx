import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { AppProvider } from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <NextUIProvider>
        {/* Dark Mode */}
        <div className="min-h-screen min-w-screen flex justify-center items-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 text-gray-800">
          <App />
        </div>
      </NextUIProvider>
    </AppProvider>
  </StrictMode>
);
