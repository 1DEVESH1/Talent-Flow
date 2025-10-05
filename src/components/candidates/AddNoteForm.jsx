import React, { useRef, useState } from "react";

export const AddNoteForm = ({ onSubmit, isSubmitting }) => {
  const noteRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const noteContent = noteRef.current.value;
    if (!noteContent.trim()) return;
    onSubmit(noteContent);
    noteRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h3 className="text-lg font-bold mb-2">Add a Note</h3>
      <textarea
        ref={noteRef}
        placeholder="Add a note... use @ to mention a user."
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        rows="4"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "Adding Note..." : "Add Note"}
        </button>
      </div>
    </form>
  );
};