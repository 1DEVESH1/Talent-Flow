import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// --- API Functions ---

// Fetches the full list of candidates
const getCandidates = async () => {
  const { data } = await axios.get("/candidates");
  return data;
};

// Fetches a single candidate by their ID
const getCandidate = async (candidateId) => {
  const { data } = await axios.get(`/candidates/${candidateId}`);
  return data;
};

// Fetches the timeline for a single candidate
const getCandidateTimeline = async (candidateId) => {
  const { data } = await axios.get(`/candidates/${candidateId}/timeline`);
  return data;
};

// Updates a candidate's hiring stage
const updateCandidateStage = async ({ id, stage }) => {
  const { data } = await axios.patch(`/candidates/${id}`, { stage });
  return data;
};

// --- Query & Mutation Hooks ---

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
    enabled: !!candidateId, // The query will not run until candidateId is available
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
    // Optimistically update the UI for a smooth experience
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
    // If the mutation fails, roll back to the previous state
    onError: (err, updatedCandidate, context) => {
      queryClient.setQueryData(["candidates"], context.previousCandidates);
    },
    // After the mutation is complete (either success or error), refetch the data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}
