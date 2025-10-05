import React from "react";
import { Link } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { FaGripVertical } from "react-icons/fa"; 

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
      className="p-4 mb-2 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-shadow flex items-center space-x-4"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700"
      >
        <FaGripVertical />
      </div>
      <div className="flex-grow">
        <Link to={`/candidates/${candidate.id}`}>
          <p className="font-semibold text-gray-800">{candidate.name}</p>
          <p className="text-sm text-gray-500">{candidate.email}</p>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(CandidateCard);
