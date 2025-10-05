import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getCandidates = async () => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/candidates.json");
    return response.json();
  }
  const { data } = await axios.get("/candidates");
  return data;
};

const getCandidate = async (candidateId) => {
  if (import.meta.env.PROD) {
    const response = await fetch("/api/candidates.json");
    const candidates = await response.json();
    return candidates.find((c) => c.id === parseInt(candidateId, 10));
  }
  const { data } = await axios.get(`/candidates/${candidateId}`);
  return data;
};

const getCandidateTimeline = async (candidateId) => {
  if (import.meta.env.PROD) {
    return Promise.resolve([
      { event: "Applied (Demo)", date: "2024-10-01" },
      { event: "Moved to Screen stage (Demo)", date: "2024-10-03" },
    ]);
  }
  const { data } = await axios.get(`/candidates/${candidateId}/timeline`);
  return data;
};

const updateCandidateStage = async ({ id, stage }) => {
  if (import.meta.env.PROD) {
    return Promise.resolve({ success: true });
  }
  const { data } = await axios.patch(`/candidates/${id}`, { stage });
  return data;
};

export function useGetCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });
}

export function useGetCandidate(candidateId) {
  return useQuery({
    queryKey: ["candidates", candidateId],
    queryFn: () => getCandidate(candidateId),
    enabled: !!candidateId,
  });
}

export function useGetCandidateTimeline(candidateId) {
  return useQuery({
    queryKey: ["candidates", candidateId, "timeline"],
    queryFn: () => getCandidateTimeline(candidateId),
    enabled: !!candidateId,
  });
}

export function useUpdateCandidateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCandidateStage,
    onMutate: async (updatedCandidate) => {
      await queryClient.cancelQueries({ queryKey: ["candidates"] });
      const previousCandidates = queryClient.getQueryData(["candidates"]);

      queryClient.setQueryData(["candidates"], (oldCandidates = []) =>
        oldCandidates.map((c) =>
          c.id === updatedCandidate.id ? { ...c, ...updatedCandidate } : c
        )
      );

      return { previousCandidates };
    },
    onError: (err, updatedCandidate, context) => {
      queryClient.setQueryData(["candidates"], context.previousCandidates);
    },
    onSettled: () => {
      if (import.meta.env.DEV) {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["candidates"] });
        }, 250);
      }
    },
  });
}
