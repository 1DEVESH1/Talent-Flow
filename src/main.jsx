import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();
async function prepareApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser.js");
    const { seedDatabase } = await import("./database/seed.js");
    await seedDatabase();
    return worker.start({ onUnhandledRequest: "bypass" });
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
});

