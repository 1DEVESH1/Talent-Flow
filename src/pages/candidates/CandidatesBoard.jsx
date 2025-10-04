import React, { useMemo, useState, useEffect } from "react";
// 👇 1. Add the missing imports here
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useGetCandidates,
  useUpdateCandidateStage,
} from "../../api/candidates.js";
import CandidateCard from "../../components/candidates/CandidateCard.jsx";
// 👇 2. Corrected the import path (removed extra .jsx)
import KanbanColumn from "../../features/KanbanColumn.jsx";

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export function CandidatesBoard() {
  const { data: candidates = [], isLoading, isError } = useGetCandidates();
  const updateStageMutation = useUpdateCandidateStage();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Configure sensors for instant drag start
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Start drag after 1px of movement
      },
    }),
    useSensor(TouchSensor, {
      // Also configure for touch devices
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const filteredCandidates = useMemo(() => {
    if (!debouncedSearchTerm) {
      return candidates;
    }
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearchTerm) ||
        c.email.toLowerCase().includes(debouncedSearchTerm)
    );
  }, [candidates, debouncedSearchTerm]);

  const groupedCandidates = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = filteredCandidates.filter((c) => c.stage === stage);
      return acc;
    }, {});
  }, [filteredCandidates]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const draggedCandidate = active.data.current?.candidate;
    const targetStage = over.id;

    if (draggedCandidate && draggedCandidate.stage !== targetStage) {
      updateStageMutation.mutate({
        id: draggedCandidate.id,
        stage: targetStage,
      });
    }
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading candidates...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Error fetching candidates!
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidates Board</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn key={stage} stage={stage}>
              {groupedCandidates[stage]?.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
