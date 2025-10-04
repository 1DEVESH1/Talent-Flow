// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { worker } from "./mocks/browser.js";
// import { seedDatabase } from "./database/seed.js";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter } from "react-router-dom";

// // Create a client for React Query
// const queryClient = new QueryClient();

// // We wrap this in an async function to use await
// async function prepareApp() {
//   // We only want to run the mock server in development
//   if (process.env.NODE_ENV === "development") {
//     await seedDatabase();
//     // The start method is async and returns a promise
//     return worker.start({ onUnhandledRequest: "bypass" });
//   }
//   return Promise.resolve();
// }

// // Start the app after the mock server is ready
// prepareApp().then(() => {
//   createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//       <QueryClientProvider client={queryClient}>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </QueryClientProvider>
//     </React.StrictMode>
//   );
// });
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

