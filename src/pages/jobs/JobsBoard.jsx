import { useCallback, useEffect, useState } from "react";
import { useGetJobs, useReorderJob, useUpdateJob } from "../../api/jobs";
import { JobFormModal } from "../../components/jobs/JobFormModal";
import SortableJobItem from "../../components/jobs/SortableJobItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function JobsBoard() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({ status: "all" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const queryFilters = {
    search: debouncedSearchTerm,
    status: filters.status,
    page,
    pageSize,
  };
  const jobsQueryKey = ["jobs", queryFilters];

  const { data, isLoading, isError } = useGetJobs(queryFilters);
  const { jobs = [], totalCount = 0 } = data || {};

  const updateJobMutation = useUpdateJob(jobsQueryKey);
  const reorderJobMutation = useReorderJob(jobsQueryKey);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filters.status]);

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
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Jobs Board ({totalCount} Total)
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            name="search"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md p-2 w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            onClick={handleCreateClick}
          >
            Add Job
          </button>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 items-center p-4 font-bold text-gray-500 text-sm uppercase">
        <div className="col-span-1"></div>
        <div className="col-span-1">Order</div>
        <div className="col-span-5">Job Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Actions</div>
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

      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

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
