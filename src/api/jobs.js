import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

const getJobs = async (filters) => {
  const { page = 1, pageSize = 10, ...otherFilters } = filters;

  if (import.meta.env.PROD) {
    const response = await fetch("/api/jobs.json");
    let allJobs = await response.json();
    if (otherFilters.search) {
      allJobs = allJobs.filter((j) =>
        j.title.toLowerCase().includes(otherFilters.search.toLowerCase())
      );
    }
    if (otherFilters.status && otherFilters.status !== "all") {
      allJobs = allJobs.filter((j) => j.status === otherFilters.status);
    }

    const totalCount = allJobs.length;
    const paginatedJobs = allJobs.slice((page - 1) * pageSize, page * pageSize);
    return { jobs: paginatedJobs, totalCount };
  }

  const params = new URLSearchParams({
    page,
    pageSize,
    ...otherFilters,
  }).toString();
  const { data } = await axios.get(`/jobs?${params}`);
  return data;
};

const getJob = async (jobId) => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/jobs.json");
    const jobs = await response.json();
    return jobs.find((j) => j.id === parseInt(jobId, 10));
  }
  const { data } = await axios.get(`/jobs/${jobId}`);
  return data;
};

const createJob = async (newJob) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ ...newJob, id: Date.now() });
  }
  const { data } = await axios.post("/jobs", newJob);
  return data;
};

const updateJob = async ({ id, ...updates }) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ success: true });
  }
  const { data } = await axios.patch(`/jobs/${id}`, updates);
  return data;
};

const reorderJob = async (payload) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ success: true });
  }
  const { fromId, toOrder } = payload;
  const { data } = await axios.patch(`/jobs/${fromId}/reorder`, {
    fromId,
    toOrder,
  });
  return data;
};

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
      if (import.meta.env.DEV) {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }
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
    onError: (context) => {
      queryClient.setQueryData(context.queryKey, context.previousData);
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
