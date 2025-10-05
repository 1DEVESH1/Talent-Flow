import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssessment, putAssessment, submitAssessment } from "../api/assessments";

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
