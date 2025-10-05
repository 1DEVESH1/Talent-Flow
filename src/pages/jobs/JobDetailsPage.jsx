import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetJob } from "../../hooks/useJobs";

const JobDetailsPage = () => {
  const { jobId } = useParams();
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
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
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
            </div>
            <Link
              to={`/assessment/${job.id}/submit`}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Apply & Take Assessment
            </Link>
          </div>
          <div className="mt-6">
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
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
