import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  // Get initials for profile icon
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen flex flex-col max-w-sm mx-auto bg-white p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2"
          aria-label="Go back"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="flex-1 text-xl font-bold text-center text-[#2D2343]">
          My profile
        </h1>
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#FE6B8B] flex items-center justify-center text-white text-3xl font-bold mb-3 shadow">
          {user ? getInitials(user.name) : "--"}
        </div>
        {user && (
          <>
            <div className="text-lg font-semibold text-[#2D2343]">{user.name}</div>
            <div className="text-sm text-gray-500 mb-1">{user.username}</div>
            <div className="text-sm text-gray-500 mb-1">{user.email}</div>
            <div className="text-sm text-gray-500">{user.phone}</div>
          </>
        )}
        {/* Logout button directly under user info */}
        <button
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-white shadow text-[#FE6B8B] font-semibold mt-8"
          onClick={() => setShowLogout(true)}
        >
          <span className="flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="#FE6B8B" strokeWidth="2" viewBox="0 0 24 24">
            </svg>
            Log Out
          </span>
          <svg width="22" height="22" fill="none" stroke="#FE6B8B" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {/* Logout confirmation popup */}
      {showLogout && (
        <div className="fixed inset-0 bg-gray bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs w-full text-center flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-[#222]">
              Are you sure you want to log out?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-[#2D2343] font-semibold"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#FE6B8B] text-white font-semibold"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;