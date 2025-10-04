import { useCallback, useEffect, useState } from "react";
import { useGetJobs, useReorderJob, useUpdateJob } from "../api/jobs";
import { JobFormModal } from "../components/jobs/JobFormModal";
import SortableJobItem from "../components/jobs/SortableJobItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function JobsBoard() {
  const [filters, setFilters] = useState({ status: "all" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const queryFilters = { search: debouncedSearchTerm, status: filters.status };
  const jobsQueryKey = ["jobs", queryFilters];
  const { data: jobs = [], isLoading, isError } = useGetJobs(queryFilters);
  const updateJobMutation = useUpdateJob(jobsQueryKey);
  const reorderJobMutation = useReorderJob(jobsQueryKey);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleStatusChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleCreateClick = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleEditClick = useCallback((job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const handleArchive = useCallback(
    (job) => {
      if (!job) return;
      const newStatus = job.status === "active" ? "archived" : "active";
      updateJobMutation.mutate({ id: job.id, status: newStatus });
    },
    [updateJobMutation]
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const fromJob = jobs.find((j) => j.id === active.id);
      const toJob = jobs.find((j) => j.id === over.id);
      const payload = {
        fromId: fromJob?.id,
        fromOrder: fromJob?.order,
        toOrder: toJob?.order,
      };
      reorderJobMutation.mutate({ active, over, payload });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading jobs...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error fetching jobs!</div>
    );

  return (
    <div className="p-8">
      <div className="flex mb-6 items-center">
        <h1 className="text-2xl font-bold text-gray-800">Jobs Board</h1>
        <div className="flex-grow" />
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleCreateClick}
        >
          Create New Job
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          name="search"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-md p-2 w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {jobs.map((job) => (
              <SortableJobItem
                key={job.id}
                job={job}
                onEdit={handleEditClick}
                onArchive={handleArchive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <JobFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          job={selectedJob}
          jobsQueryKey={jobsQueryKey}
        />
      )}
    </div>
  );
}
