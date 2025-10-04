import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Style lookup objects for status tags and archive buttons
const statusStyles = {
  active: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

const archiveButtonStyles = {
  active: "bg-orange-500 text-white hover:bg-orange-600",
  archived: "bg-teal-500 text-white hover:bg-teal-600",
};

const SortableJobItem = ({ job, onEdit, onArchive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 border border-gray-200 rounded-lg bg-white mb-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        {/* Job Title and Order */}
        <div>
          <p className="font-bold text-gray-800">{job.title}</p>
          <p className="text-sm text-gray-500">Order: {job.order}</p>
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Tags and Buttons */}
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
              statusStyles[job.status]
            }`}
          >
            {job.status}
          </span>
          <button
            className="bg-gray-200 text-gray-800 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-300"
            onClick={() => onEdit(job)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Edit
          </button>
          <button
            className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${
              archiveButtonStyles[job.status]
            }`}
            onClick={() => onArchive(job)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {job.status === "active" ? "Archive" : "Unarchive"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SortableJobItem);
