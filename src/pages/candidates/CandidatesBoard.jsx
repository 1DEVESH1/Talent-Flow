import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
} from "../../hooks/useCandidates.js";
import CandidateCard from "../../components/candidates/CandidateCard.jsx";
import KanbanColumn from "../../components/candidates/KanbanColumn.jsx";

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export function CandidatesBoard() {
  const { data: candidates = [], isLoading, isError } = useGetCandidates();
  const updateStageMutation = useUpdateCandidateStage();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

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

  const handleSearchChange = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (searchInputRef.current) {
        setDebouncedSearchTerm(searchInputRef.current.value.toLowerCase());
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (isLoading)
    return <div className="p-8 text-center">Loading candidates...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Error fetching candidates!
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900 drop-shadow">
          Candidates Board
        </h1>
        <div className="flex justify-center mb-8">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or email..."
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-full px-5 py-3 w-full max-w-md shadow focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {STAGES.map((stage) => (
              <div
                key={stage}
                className="bg-white/90 rounded-xl shadow-lg min-w-[320px] max-w-xs flex-1 flex flex-col"
              >
                <KanbanColumn stage={stage}>
                  {groupedCandidates[stage]?.map((candidate) => (
                    <div key={candidate.id} className="mb-4 last:mb-0">
                      <CandidateCard candidate={candidate} />
                    </div>
                  ))}
                </KanbanColumn>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
export default CandidatesBoard;
