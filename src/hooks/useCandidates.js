import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCandidates, getCandidate, getCandidateTimeline, updateCandidateStage, addCandidateNote } from "../api/candidates";
import { toast } from "react-hot-toast";

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
export function useAddCandidateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCandidateNote,
    onSuccess: (data, variables) => {
      toast.success("Note added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["candidates", variables.candidateId, "timeline"],
      });
    },
    onError: () => {
      toast.error("Failed to add note.");
    },
  });
}
