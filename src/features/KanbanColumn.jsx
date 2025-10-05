import React from "react";
import { useDroppable } from "@dnd-kit/core";

const KanbanColumn = ({ stage, children }) => {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 p-4 bg-gray-100 rounded-lg min-h-[200px] w-[280px] flex-shrink-0"
    >
      <h2 className="mb-4 text-lg font-bold text-gray-700 capitalize border-b pb-2">
        {stage}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default React.memo(KanbanColumn);
