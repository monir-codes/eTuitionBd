import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

createRoot(document.getElementById("root")).render(
  <StrictMode>
 <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise}>

      <RouterProvider router={router}></RouterProvider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
        toastStyle={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 'bold' }}
      />
        </Elements>
    </AuthProvider>
 </QueryClientProvider>
  </StrictMode>,
);
