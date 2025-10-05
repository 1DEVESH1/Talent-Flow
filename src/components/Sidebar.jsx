import React from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    if (isOpen) {
      onClose();
    }
  };

  return (
    <>
       {/* Sidebar for larger screens  */}
      <div className="hidden md:flex flex-col border-r border-gray-200 min-h-full pt-6">
        <NavLink
          to="/"
          className={({ isActive }) => `flex
                        items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer
                        ${
                          isActive && "bg-primary/10 border-r-4 border-primary"
                        }`}
        >
          <p>Home</p>
        </NavLink>
        <NavLink
          end={true}
          to="/jobs"
          className={({
            isActive,
          }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer
                        ${
                          isActive && "bg-primary/10 border-r-4 border-primary"
                        }`}
        >
          <p>Jobs</p>
        </NavLink>
        <NavLink
          to="/candidates"
          className={({ isActive }) => `flex
                        items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer
                        ${
                          isActive && "bg-primary/10 border-r-4 border-primary"
                        }`}
        >
          <p>Candidates</p>
        </NavLink>
        <NavLink
          to="/assignments"
          className={({ isActive }) => `flex
                        items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer
                        ${
                          isActive && "bg-primary/10 border-r-4 border-primary"
                        }`}
        >
          <p>Assignment</p>
        </NavLink>
      </div>

      {/* Sidebar for smaller screens (mobile) */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
                   transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                   transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="pt-2">
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className={({ isActive }) => `flex
                            items-center gap-3 py-3.5 px-9 cursor-pointer
                            ${
                              isActive &&
                              "bg-primary/10 border-r-4 border-primary"
                            }`}
          >
            <p>Home</p>
          </NavLink>
          <NavLink
            end={true}
            to="/jobs"
            onClick={handleLinkClick}
            className={({ isActive }) => `flex
                            items-center gap-3 py-3.5 px-9 cursor-pointer
                            ${
                              isActive &&
                              "bg-primary/10 border-r-4 border-primary"
                            }`}
          >
            <p>Jobs</p>
          </NavLink>
          <NavLink
            to="/candidates"
            onClick={handleLinkClick}
            className={({ isActive }) => `flex
                            items-center gap-3 py-3.5 px-9 cursor-pointer
                            ${
                              isActive &&
                              "bg-primary/10 border-r-4 border-primary"
                            }`}
          >
            <p>Candidates</p>
          </NavLink>
          <NavLink
            to="/assignments"
            onClick={handleLinkClick}
            className={({ isActive }) => `flex
                            items-center gap-3 py-3.5 px-9 cursor-pointer
                            ${
                              isActive &&
                              "bg-primary/10 border-r-4 border-primary"
                            }`}
          >
            <p>Assignment</p>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
