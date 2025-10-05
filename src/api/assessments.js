import axios from "axios";

export const getAssessment = async (jobId) => {
  const { data } = await axios.get(`/assessments/${jobId}`);
  return data;
};

export const putAssessment = async ({ jobId, config }) => {
  const { data } = await axios.put(`/assessments/${jobId}`, { config });
  return data;
};

export const submitAssessment = async ({ jobId, candidateId, responses }) => {
  const { data } = await axios.post(`/assessments/${jobId}/submit`, {
    candidateId,
    responses,
  });
  return data;
};
