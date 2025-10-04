import React from "react";
const QuestionRenderer = ({ question }) => {
  switch (question.type) {
    case "short-text":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {question.label}
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      );
    case "multi-choice":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {question.label}
          </label>
          <div className="mt-2 space-y-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Option 1</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Option 2</span>
            </label>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const AssessmentPreview = ({ questions }) => {
  return (
    <div>
      {questions.map((question) => (
        <QuestionRenderer key={question.id} question={question} />
      ))}
    </div>
  );
};
