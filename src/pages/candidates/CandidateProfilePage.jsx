import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCandidate, useGetCandidateTimeline } from "../../api/candidates";
import { HiOutlineCalendar, HiOutlinePencilAlt } from "react-icons/hi";

const TimelineItem = ({ event }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <span className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
        {event.content ? <HiOutlinePencilAlt /> : <HiOutlineCalendar />}
      </span>
      <div className="flex-grow w-px bg-gray-300"></div>
    </div>
    <div className="pb-8">
      <p className="font-semibold text-gray-800">{event.event}</p>
      {event.content && (
        <p className="text-gray-600 bg-gray-100 p-2 rounded-md mt-1">
          {event.content}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-1">{event.date}</p>
    </div>
  </div>
);

export const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const {
    data: candidate,
    isLoading: isLoadingCandidate,
    isError: isErrorCandidate,
  } = useGetCandidate(candidateId);
  const {
    data: timeline,
    isLoading: isLoadingTimeline,
    isError: isErrorTimeline,
  } = useGetCandidateTimeline(candidateId);

  if (isLoadingCandidate || isLoadingTimeline)
    return <div className="p-8">Loading profile...</div>;
  if (isErrorCandidate || isErrorTimeline)
    return (
      <div className="p-8 text-red-500">Error loading candidate details.</div>
    );

  return (
    <div>
      <Link
        to="/candidates"
        className="text-blue-500 hover:underline mb-6 block"
      >
        &larr; Back to Candidates Board
      </Link>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-1">{candidate?.name}</h2>
          <p className="text-gray-600 mb-4">{candidate?.email}</p>
          <span
            className={`capitalize px-3 py-1 text-sm font-semibold rounded-full ${
              candidate?.stage === "hired"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {candidate?.stage}
          </span>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Timeline</h3>
          <div>
            {timeline?.map((event, index) => (
              <TimelineItem key={index} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
