import React, { useState } from "react";
import { AssessmentPreview } from "../components/assessments/AssessmentPreview";

export const Assignments = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState("short-text");

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: newQuestionType,
      label: "New Question",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assessment Builder</h1>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          <div className="flex gap-2 mb-4">
            <select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 flex-grow"
            >
              <option value="short-text">Short Text</option>
              <option value="multi-choice">Multi-Choice</option>
            </select>
            <button
              onClick={addQuestion}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add New Question
            </button>
          </div>
          {questions.length === 0 ? (
            <div className="mt-4 text-center text-gray-500">
              No questions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="p-4 border rounded-md">
                  <p className="font-semibold">
                    {q.label} ({q.type})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          <div className="p-4 border border-dashed border-gray-300 rounded-lg min-h-[300px]">
            {questions.length > 0 ? (
              <AssessmentPreview questions={questions} />
            ) : (
              <p className="text-center text-gray-500">
                Your assessment form will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
