import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetJobs } from "../api/jobs";

export const AssignmentsDashboard = () => {
  const navigate = useNavigate();
  const { data: jobsData, isLoading } = useGetJobs({ pageSize: 100 });
  const [selectedJobId, setSelectedJobId] = useState("");
  useEffect(() => {
    if (jobsData?.jobs?.length > 0) {
      setSelectedJobId(jobsData.jobs[0].id);
    }
  }, [jobsData]);

  const handleSelect = () => {
    if (selectedJobId) {
      navigate(`/assignments/${selectedJobId}`);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading jobs...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Select a Job</h1>
      <p className="text-gray-600 mb-6 text-center">
        Choose a job from the list below to view or edit its assessment.
      </p>

      <div className="flex flex-col gap-4">
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500"
        >
          {jobsData?.jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!selectedJobId}
          className="bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          Go to Assessment Builder
        </button>
      </div>
    </div>
  );
};
