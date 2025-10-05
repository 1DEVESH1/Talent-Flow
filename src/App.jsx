import React, { useState, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
const JobsBoard = React.lazy(() => import("./pages/jobs/JobsBoard"));
const CandidatesBoard = React.lazy(() =>
  import("./pages/candidates/CandidatesBoard")
);
const Assignments = React.lazy(() => import("./pages/assessment/Assessment"));
const JobDetailsPage = React.lazy(() => import("./pages/jobs/JobDetailsPage"));
const CandidateProfilePage = React.lazy(() =>
  import("./pages/candidates/CandidateProfilePage")
);
const AssessmentForm = React.lazy(() =>
  import("./pages/assessment/AssessmentForm")
);
const AssignmentsDashboard = React.lazy(() =>
  import("./pages/assessment/AssessmentDashboard")
);

const PageLoader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="text-lg font-semibold">Loading Page...</div>
  </div>
);
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
      <Toaster position="top-center" reverseOrder={false} />
      <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-grow p-4 md:p-8 bg-gray-50">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
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
        <Route path="assignments" element={<AssignmentsDashboard />} />
        <Route path="assignments/:jobId" element={<Assignments />} />
        <Route path="/assessment/:jobId/submit" element={<AssessmentForm />} />
      </Route>
    </Routes>
  );
}

export default App;
