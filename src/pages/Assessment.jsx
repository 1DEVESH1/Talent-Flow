import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AssessmentPreview } from "../components/assessments/AssessmentPreview";
import { FaPlus, FaSave, FaTrash, FaLink } from "react-icons/fa";
import { useGetAssessment, usePutAssessment } from "../api/assessments";
import { useGetJob } from "../api/jobs";

const QuestionEditor = ({ question, allQuestions, onUpdate, onDelete }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate(question.id, {
      ...question,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOptionChange = (optionId, optionValue) => {
    const newOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, value: optionValue } : opt
    );
    onUpdate(question.id, { ...question, options: newOptions });
  };

  const addOption = () => {
    const newOption = { id: Date.now(), value: "" };
    const options = question.options
      ? [...question.options, newOption]
      : [newOption];
    onUpdate(question.id, { ...question, options });
  };

  const deleteOption = (optionId) => {
    onUpdate(question.id, {
      ...question,
      options: question.options.filter((opt) => opt.id !== optionId),
    });
  };

  const handleConditionChange = (e) => {
    const { name, value } = e.target;
    if (name === "questionId" && !value) {
      onUpdate(question.id, { ...question, condition: undefined });
    } else {
      onUpdate(question.id, { ...question, condition: { questionId: value } });
    }
  };

  const conditionalQuestions = allQuestions.filter((q) => q.id !== question.id);

  return (
    <div className="p-4 border rounded-md bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <input
          type="text"
          name="label"
          value={question.label}
          onChange={handleInputChange}
          className="font-semibold border-b-2 flex-grow mr-4"
          placeholder="Enter your question label"
        />
        <div className="flex items-center gap-4">
          <select
            name="type"
            value={question.type}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="short-text">Short Text</option>
            <option value="long-text">Long Text</option>
            <option value="single-choice">Single Choice</option>
            <option value="multi-choice">Multi-Choice</option>
            <option value="numeric">Numeric</option>
            <option value="file-upload">File Upload</option>
          </select>
          <button
            onClick={() => onDelete(question.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      {(question.type === "single-choice" ||
        question.type === "multi-choice") && (
        <div className="pl-4 space-y-2">
          <h4 className="font-medium text-sm">Options:</h4>
          {question.options?.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type={question.type === "single-choice" ? "radio" : "checkbox"}
                readOnly
                disabled
              />
              <input
                type="text"
                value={opt.value}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                className="border-b flex-grow"
                placeholder="Option text"
              />
              <button
                onClick={() => deleteOption(opt.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={addOption} className="text-sm text-blue-500 mt-2">
            Add Option
          </button>
        </div>
      )}
      {question.type === "numeric" && (
        <div className="flex gap-4 items-center">
          <input
            type="number"
            name="min"
            placeholder="Min value"
            value={question.min || ""}
            onChange={handleInputChange}
            className="border p-1 rounded-md w-24"
          />
          <input
            type="number"
            name="max"
            placeholder="Max value"
            value={question.max || ""}
            onChange={handleInputChange}
            className="border p-1 rounded-md w-24"
          />
        </div>
      )}
      <div className="flex items-center gap-2 pt-2 border-t mt-3">
        <input
          type="checkbox"
          name="required"
          id={`required-${question.id}`}
          checked={!!question.required}
          onChange={handleInputChange}
        />
        <label htmlFor={`required-${question.id}`}>Required</label>
      </div>
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <FaLink />
          <span>Conditional Display</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm pl-4">
          <span>Show this question if</span>
          <select
            name="questionId"
            value={question.condition?.questionId || ""}
            onChange={handleConditionChange}
            className="border p-1 rounded-md max-w-[200px] truncate"
          >
            <option value="">-- Select a Question --</option>
            {conditionalQuestions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label || "Untitled Question"}
              </option>
            ))}
          </select>
          <span>has any answer.</span>
        </div>
      </div>
    </div>
  );
};

export const Assignments = () => {
  const { jobId } = useParams();
  const [questions, setQuestions] = useState([]);
  const { data: job } = useGetJob(jobId);
  const { data: assessmentData, isLoading } = useGetAssessment(jobId);
  const putAssessmentMutation = usePutAssessment(jobId);

  useEffect(() => {
    setQuestions(assessmentData?.config || []);
  }, [assessmentData]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), type: "short-text", label: "", required: false },
    ]);
  };
  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(questions.map((q) => (q.id === id ? updatedQuestion : q)));
  };
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };
  const handleSave = () => {
    putAssessmentMutation.mutate({ jobId, config: questions });
  };

  return (
    <div>
      <Link to="/jobs" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Jobs Board
      </Link>
      <h1 className="text-3xl font-bold mb-2">Assessment Builder</h1>
      <p className="text-gray-600 mb-6">
        Editing assessment for job:{" "}
        <strong className="text-gray-800">
          {job?.title || `ID: ${jobId}`}
        </strong>
      </p>
      {isLoading ? (
        <div className="p-8 text-center">Loading assessment...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Questions</h2>
              <div className="flex gap-2">
                <button
                  onClick={addQuestion}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPlus /> Add Question
                </button>
                <button
                  onClick={handleSave}
                  disabled={putAssessmentMutation.isPending}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-2 disabled:bg-gray-400"
                >
                  <FaSave />{" "}
                  {putAssessmentMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            {questions.length === 0 ? (
              <div className="mt-4 text-center text-gray-500 border-2 border-dashed rounded-lg p-8">
                No questions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <QuestionEditor
                    key={q.id}
                    question={q}
                    allQuestions={questions}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg min-h-[300px]">
              <AssessmentPreview
                questions={questions}
                responses={{}}
                onInputChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
