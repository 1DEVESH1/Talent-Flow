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

export const useUpdateCandidateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stage }) => {
      const response = await fetch(`/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!response.ok) {
        throw new Error("Failed to update candidate stage");
      }
      return response.json();
    },
    // Optimistic update logic
    onMutate: async (newCandidate) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["candidates"] });

      // Snapshot the previous value
      const previousCandidates = queryClient.getQueryData(["candidates"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["candidates"], (old) =>
        old.map((candidate) =>
          candidate.id === newCandidate.id
            ? { ...candidate, ...newCandidate }
            : candidate
        )
      );

      // Return a context object with the snapshotted value
      return { previousCandidates };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newCandidate, context) => {
      queryClient.setQueryData(["candidates"], context.previousCandidates);
    },
    // Always refetch after error or success to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};
