// src/components/Navbar.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "";

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="bg-primary text-white px-4 py-2 flex items-center justify-between shadow">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="hover:underline font-semibold">Dashboard</Link>
        <Link to="/upload" className="hover:underline font-semibold">Upload</Link>
        <Link to="/rewards" className="hover:underline font-semibold">Rewards</Link>
      </div>
      <div className="flex items-center gap-4">
        {email && <span className="text-sm">{email}</span>}
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
