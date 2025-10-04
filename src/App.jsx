import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { JobsBoard } from "./pages/jobs/JobsBoard";
import { CandidatesBoard } from "./pages/candidates/CandidatesBoard";
import Assignments from "./pages/Assignments";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
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
        <Route path="candidates" element={<CandidatesBoard />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
