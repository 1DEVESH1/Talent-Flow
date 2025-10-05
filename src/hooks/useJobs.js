import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, getJob, getJobs, reorderJob, updateJob } from "../api/jobs";
import { toast } from "react-hot-toast";
import { arrayMove } from "../utils/array.js";


export function useGetJobs(filters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
  });
}

export function useGetJob(jobId) {
  return useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Job created successfully!");
      if (import.meta.env.DEV) {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }
    },
    onError: () => {
      toast.error("Failed to create job.");
    },
  });
}

export function useUpdateJob(queryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJob,
    onMutate: async (updatedJob) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData) => {
        const newJobs = oldData.jobs.map((job) =>
          job.id === updatedJob.id ? { ...job, ...updatedJob } : job
        );
        return { ...oldData, jobs: newJobs };
      });
      return { previousData, queryKey };
    },
    onSuccess: () => {
      toast.success("Job updated successfully!");
    },
    onError: (err, updatedJob, context) => {
      toast.error("Failed to update job.");
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled: () => {
      if (import.meta.env.DEV) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useReorderJob(queryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }) => reorderJob(payload),
    onMutate: async ({ active, over }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.jobs) return [];
        const oldIndex = oldData.jobs.findIndex((j) => j.id === active.id);
        const newIndex = oldData.jobs.findIndex((j) => j.id === over.id);
        const newJobs = arrayMove(oldData.jobs, oldIndex, newIndex);
        return {
          ...oldData,
          jobs: newJobs.map((job, idx) => ({ ...job, order: idx + 1 })),
        };
      });
      return { previousData, queryKey };
    },
    onError: (context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled: (context) => {
      if (import.meta.env.DEV) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: context?.queryKey ?? queryKey,
          });
        }, 250);
      }
    },
  });
}
