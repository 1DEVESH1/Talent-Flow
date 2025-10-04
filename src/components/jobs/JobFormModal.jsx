import { useForm } from "react-hook-form";
import { useCreateJob, useUpdateJob } from "../../api/jobs";
import { useEffect, useRef, useState } from "react";

export function JobFormModal({ isOpen, onClose, job, jobsQueryKey }) {
  const [tagsInput, setTagsInput] = useState(
    job && job.tags ? job.tags.join(", ") : ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: job || { title: "", slug: "", tags: [] },
  });

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob(jobsQueryKey);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      reset(job || { title: "", slug: "", tags: [] });
      setTagsInput(job && job.tags ? job.tags.join(", ") : "");
    }
  }, [job, isOpen, reset]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const onSubmit = (data) => {
    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    const jobData = { ...data, tags: tagsArray };
    if (job) {
      updateJobMutation.mutate({ id: job.id, ...jobData });
    } else {
      createJobMutation.mutate(jobData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">
              {job ? "Edit Job" : "Create New Job"}
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              {...register("title", { required: "Title is required" })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}

            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Tags (e.g. Full-time, Remote, Contract)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end items-center p-4 border-t gap-2">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={
                createJobMutation.isPending || updateJobMutation.isPending
              }
            >
              {createJobMutation.isPending || updateJobMutation.isPending
                ? "Saving..."
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
