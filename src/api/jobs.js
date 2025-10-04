import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

const getJobs = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axios.get(`/jobs?${params}`);
  return data;
};

const getJob = async (jobId) => {
  const { data } = await axios.get(`/jobs/${jobId}`);
  return data;
};

const createJob = async (newJob) => {
  const { data } = await axios.post("/jobs", newJob);
  return data;
};

const updateJob = async ({ id, ...updates }) => {
  const { data } = await axios.patch(`/jobs/${id}`, updates);
  return data;
};

const reorderJob = async ({ fromId, fromOrder, toOrder }) => {
  const { data } = await axios.patch(`/jobs/${fromId}/reorder`, {
    fromId,
    fromOrder, 
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
    enabled: !!jobId, // The query will not run until the jobId is available
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJob(queryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJob,
    onMutate: async (updatedJob) => {
      await queryClient.cancelQueries({ queryKey });
      const previousJobs = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldJobs) =>
        oldJobs.map((job) =>
          job.id === updatedJob.id ? { ...job, ...updatedJob } : job
        )
      );
      return { previousJobs, queryKey };
    },
    onError: (err, updatedJob, context) => {
      queryClient.setQueryData(context.queryKey, context.previousJobs);
    },
  });
}

export function useReorderJob(queryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }) => reorderJob(payload),
    onMutate: async ({ active, over }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousJobs = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldJobs) => {
        if (!oldJobs) return [];
        const oldIndex = oldJobs.findIndex((j) => j.id === active.id);
        const newIndex = oldJobs.findIndex((j) => j.id === over.id);
        const newJobs = arrayMove(oldJobs, oldIndex, newIndex);
        return newJobs.map((job, idx) => ({
          ...job,
          order: idx + 1,
        }));
      });
      return { previousJobs, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(context.queryKey, context.previousJobs);
      }
    },
    onSettled: (data, error, variables, context) => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: context?.queryKey ?? queryKey,
        });
      }, 250);
    },
  });
}
