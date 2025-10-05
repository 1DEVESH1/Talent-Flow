import axios from "axios";

export const getJobs = async (filters) => {
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

export const getJob = async (jobId) => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/jobs.json");
    const jobs = await response.json();
    return jobs.find((j) => j.id === parseInt(jobId, 10));
  }
  const { data } = await axios.get(`/jobs/${jobId}`);
  return data;
};

export const createJob = async (newJob) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ ...newJob, id: Date.now() });
  }
  const { data } = await axios.post("/jobs", newJob);
  return data;
};

export const updateJob = async ({ id, ...updates }) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ success: true });
  }
  const { data } = await axios.patch(`/jobs/${id}`, updates);
  return data;
};

export const reorderJob = async (payload) => {
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
