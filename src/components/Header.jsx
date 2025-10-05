import React from "react";
import { FaBars } from "react-icons/fa";
import adminIcon from "../assets/icons8-admin-50.png"; 
import { Link } from "react-router-dom";
const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-gray-800"
        >
          <FaBars size={24} />
        </button>
        <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
                Talent Flow
            </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <img
          src={adminIcon}
          alt="Admin Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="hidden md:block">
          <p className="font-semibold">Admin</p>
          <p className="text-sm text-gray-500">admin@talentflow.com</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
