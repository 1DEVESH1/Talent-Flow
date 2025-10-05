import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssessmentPreview } from "../../components/assessments/AssessmentPreview";
import { useGetAssessment, useSubmitAssessment } from "../../hooks/useAssessment";
import toast from "react-hot-toast";

export const AssessmentForm = () => {
  const { jobId } = useParams();
  const candidateId = 101; // hardcoded candidate ID for demo purposes

  const navigate = useNavigate();

  const { data: assessmentData, isLoading, isError } = useGetAssessment(jobId);
  const submitAssessmentMutation = useSubmitAssessment();

  const [responses, setResponses] = useState({});

  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const PageLoader = () => (
    <div className="flex justify-center items-center h-full">
      <div className="text-lg font-semibold">Loading Page...</div>
    </div>
  );

  const handleSubmit = (e) => {
    for (const question of assessmentData.config) {
      const response = responses[question.id];
      if (question.required && (!response || response.trim() === "")) {
        toast.error(`Please answer the required question: "${question.label}"`);
        return;
      }

      if (question.type === "numeric" && response) {
        const numResponse = parseFloat(response);
        const min =
          question.min !== undefined ? parseFloat(question.min) : -Infinity;
        const max =
          question.max !== undefined ? parseFloat(question.max) : Infinity;

        if (numResponse < min || numResponse > max) {
          toast.error(
            `The value for "${question.label}" must be between ${min} and ${max}.`
          );
          return;
        }
      }
    }
    toast.promise(
      submitAssessmentMutation.mutateAsync({ jobId, candidateId, responses }),
      {
        loading: "Submitting assessment...",
        success: () => {
          navigate("/jobs");
          return "Assessment submitted successfully!";
        },
        error: "Failed to submit assessment. Please try again.",
      }
    );
  };
 if (isLoading) return <PageLoader />; 
 if (isError || !assessmentData)
   return (
     <div className="p-8 text-center text-red-500">
       Could not load the assessment.
     </div>
   );


  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Assessment</h1>
      <p className="text-gray-600 mb-6">
        Please complete the following questions.
      </p>

      <form onSubmit={handleSubmit}>
        <AssessmentPreview
          questions={assessmentData.config}
          responses={responses}
          onInputChange={handleInputChange}
        />

        <div className="mt-8">
          <button
            type="submit"
            disabled={submitAssessmentMutation.isPending}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {submitAssessmentMutation.isPending
              ? "Submitting..."
              : "Submit Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AssessmentForm;
