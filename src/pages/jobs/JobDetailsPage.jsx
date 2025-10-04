import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetJob } from "../../api/jobs"; // 👈 1. Import the new hook

const JobDetailsPage = () => {
  const { jobId } = useParams();
  // 👈 2. Use the hook to fetch data, loading, and error states
  const { data: job, isLoading, isError } = useGetJob(jobId);

  if (isLoading) {
    return <div className="p-8">Loading job details...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: Job not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/jobs" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Jobs Board
      </Link>
      {job && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-600">
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                job.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {job.status}
            </span>
          </p>
          <div className="mt-4">
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Add any other job details you want to display */}
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
