import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
        toastStyle={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 'bold' }}
      />
    </AuthProvider>
  </StrictMode>,
);
