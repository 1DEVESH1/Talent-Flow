import React from "react";

export const Assignments = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assessment Builder</h1>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Form Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">
            Add New Question
          </button>
          {/* We will add the list of questions here later */}
          <div className="mt-4 text-center text-gray-500">
            No questions yet.
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          <div className="p-4 border border-dashed border-gray-300 rounded-lg min-h-[300px]">
            <p className="text-center text-gray-500">
              Your assessment form will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
