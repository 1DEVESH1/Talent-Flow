import axios from "axios";

export const getCandidates = async () => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/candidates.json");
    return response.json();
  }
  const { data } = await axios.get("/candidates");
  return data;
};

export const getCandidate = async (candidateId) => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/candidates.json");
    const candidates = await response.json();
    return candidates.find((c) => c.id === parseInt(candidateId, 10));
  }
  const { data } = await axios.get(`/candidates/${candidateId}`);
  return data;
};

export const getCandidateTimeline = async (candidateId) => {
  if (import.meta.env.PROD) {
    return Promise.resolve([
      { event: "Applied (Demo)", date: "2024-10-01" },
      { event: "Moved to Screen stage (Demo)", date: "2024-10-03" },
    ]);
  }
  const { data } = await axios.get(`/candidates/${candidateId}/timeline`);
  return data;
};

export const updateCandidateStage = async ({ id, stage }) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ success: true });
  }
  const { data } = await axios.patch(`/candidates/${id}`, { stage });
  return data;
};
export const addCandidateNote = async ({ candidateId, content }) => {
  const { data } = await axios.post(`/candidates/${candidateId}/timeline`, {
    content,
  });
  return data;
};