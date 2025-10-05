import React from "react";

const QuestionRenderer = ({ question, response, onInputChange }) => {
  const label = (
    <label className="block text-sm font-medium text-gray-700">
      {question.label}
      {question.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const handleChange = (e) => {
    const { type, value, files } = e.target;
    const newValue = type === "file" ? (files[0] ? files[0].name : "") : value;
    onInputChange(question.id, newValue);
  };

  switch (question.type) {
    case "short-text":
      return (
        <div className="mb-4">
          {label}
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required={question.required}
            value={response || ""}
            onChange={handleChange}
          />
        </div>
      );
    case "long-text":
      return (
        <div className="mb-4">
          {label}
          <textarea
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            required={question.required}
            value={response || ""}
            onChange={handleChange}
          />
        </div>
      );
    case "single-choice":
      return (
        <div className="mb-4">
          {label}
          <div className="mt-2 space-y-2">
            {question.options?.map((opt) => (
              <label key={opt.id} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  className="form-radio"
                  value={opt.value}
                  checked={response === opt.value}
                  onChange={handleChange}
                />
                <span className="ml-2">{opt.value}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case "multi-choice":
      return (
        <div className="mb-4">
          {label}
          <div className="mt-2 space-y-2">
            {question.options?.map((opt) => (
              <label key={opt.id} className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">{opt.value}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case "numeric":
      return (
        <div className="mb-4">
          {label}
          <input
            type="number"
            min={question.min}
            max={question.max}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required={question.required}
            value={response || ""}
            onChange={handleChange}
          />
        </div>
      );
    case "file-upload":
      return (
        <div className="mb-4">
          {label}
          <input
            type="file"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={question.required}
            onChange={handleChange}
          />
        </div>
      );
    default:
      return null;
  }
};

export const AssessmentPreview = ({
  questions,
  responses = {},
  onInputChange = () => {},
}) => {
  const isQuestionVisible = (question) => {
    if (!question.condition || !question.condition.questionId) {
      return true;
    }
    const triggerQuestionResponse = responses[question.condition.questionId];
    return triggerQuestionResponse && triggerQuestionResponse.trim() !== "";
  };

  return (
    <div>
      {questions.filter(isQuestionVisible).map((question) => (
        <QuestionRenderer
          key={question.id}
          question={question}
          response={responses[question.id]}
          onInputChange={onInputChange}
        />
      ))}
    </div>
  );
};
