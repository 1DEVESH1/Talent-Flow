import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getAssessment = async (jobId) => {
  const { data } = await axios.get(`/assessments/${jobId}`);
  return data;
};

const putAssessment = async ({ jobId, config }) => {
  const { data } = await axios.put(`/assessments/${jobId}`, { config });
  return data;
};

const submitAssessment = async ({ jobId, candidateId, responses }) => {
  const { data } = await axios.post(`/assessments/${jobId}/submit`, {
    candidateId,
    responses,
  });
  return data;
};

export function useGetAssessment(jobId) {
  return useQuery({
    queryKey: ["assessments", jobId],
    queryFn: () => getAssessment(jobId),
    enabled: !!jobId,
  });
}

export function usePutAssessment(jobId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries(["assessments", jobId]);
    },
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
