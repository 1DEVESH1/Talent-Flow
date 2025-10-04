import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar"; 
import { JobsBoard } from "./pages/JobsBoard";
import Candidates from "./pages/Candidates";
import Assignments from "./pages/Assignments";
const Home = () => (
  <div>
    <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
    <p className="mt-2 text-gray-600">
      Select an option from the sidebar to get started.
    </p>
  </div>
);

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobsBoard />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="assignments" element={<Assignments />} />  
      </Route>
    </Routes>
  );
}

export default App;
