import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { JobsBoard } from "./pages/jobs/JobsBoard";
import { CandidatesBoard } from "./pages/candidates/CandidatesBoard";
import Assignments from "./pages/Assessment";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import { CandidateProfilePage } from "./pages/candidates/CandidateProfilePage";

const Home = () => (
  <div>
    <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
    <p className="mt-2 text-gray-600">
      Select an option from the sidebar to get started.
    </p>
  </div>
);

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-grow p-4 md:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobsBoard />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="candidates" element={<CandidatesBoard />} />
        <Route
          path="candidates/:candidateId"
          element={<CandidateProfilePage />}
        />
        <Route path="assignments" element={<Assignments />} />
      </Route>
    </Routes>
  );
}

export default App;
