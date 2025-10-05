import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaGripVertical,
  FaPencilAlt,
  FaTrash,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const statusStyles = {
  active: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const SortableJobItem = ({ job, onEdit, onArchive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="col-span-1 cursor-grab text-gray-400 hover:text-gray-700"
      >
        <FaGripVertical />
      </div>

      <div className="col-span-1 text-sm text-gray-500">{job.order}</div>

      <div className="col-span-4">
        {" "}
        <Link
          to={`/jobs/${job.id}`}
          className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          {job.title}
        </Link>
      </div>
      <div className="col-span-2">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
            statusStyles[job.status]
          }`}
        >
          {job.status}
        </span>
      </div>
      <div className="col-span-4 flex justify-end items-center space-x-4">
        {" "}
        <Link
          to={`/assignments/${job.id}`}
          className="text-gray-500 hover:text-green-600 transition-colors"
          title="Edit Assessment"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaClipboardList />
        </Link>
        <button
          className="text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onEdit(job)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaPencilAlt />
        </button>
        <button
          className="text-gray-500 hover:text-red-600 transition-colors"
          onClick={() => onArchive(job)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default React.memo(SortableJobItem);
