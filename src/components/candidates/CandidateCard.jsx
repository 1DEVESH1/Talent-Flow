import React from "react";
import { Link } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
const CandidateCard = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
    data: { candidate },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="p-4 mb-2 bg-white border border-gray-200 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
      >
    <Link to={`/candidates/${candidate.id}`}>
        <p className="font-semibold text-gray-800">{candidate.name}</p>
        <p className="text-sm text-gray-500">{candidate.email}</p>
    </Link>
      </div>
  );
};

export default React.memo(CandidateCard);
