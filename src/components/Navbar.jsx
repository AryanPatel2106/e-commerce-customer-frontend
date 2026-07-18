import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();

    navigate("/");
  };

  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase();

  return (
    <>
      <nav className="relative flex items-center justify-between gap-6 bg-white px-8 py-4 shadow-md">
        {/* Left Menu Button */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo + Search */}

        <div className="flex flex-1 items-center gap-8">
          <h1 className="text-2xl font-bold whitespace-nowrap text-blue-600">
            Omnicart
          </h1>

          <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-4 py-2.5 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              className="flex items-center justify-center bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="
                                        m21 21-4.35-4.35
                                        m0 0
                                        A7.5 7.5 0 1 0 6.05 6.05
                                        a7.5 7.5 0 0 0 10.6 10.6Z
                                    "
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white hover:bg-blue-700"
          >
            {firstLetter}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);

                  navigate("/profile");
                }}
                className="w-full px-5 py-3 text-left hover:bg-slate-100"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);

                  navigate("/settings");
                }}
                className="w-full px-5 py-3 text-left hover:bg-slate-100"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full border-t border-slate-200 px-5 py-3 text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Background Overlay */}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">Menu</h2>

          <button onClick={() => setIsMenuOpen(false)} className="text-2xl">
            ×
          </button>
        </div>

        <div className="flex flex-col">
          <button
            onClick={() => {
              navigate("/dashboard");

              setIsMenuOpen(false);
            }}
            className="px-6 py-4 text-left hover:bg-slate-100"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/settings");

              setIsMenuOpen(false);
            }}
            className="px-6 py-4 text-left hover:bg-slate-100"
          >
            Settings
          </button>

          <button
            onClick={() => {
              navigate("/cart");

              setIsMenuOpen(false);
            }}
            className="px-6 py-4 text-left hover:bg-slate-100"
          >
            Cart
          </button>

          <button
            onClick={() => {
              navigate("/my-orders");

              setIsMenuOpen(false);
            }}
            className="px-6 py-4 text-left hover:bg-slate-100"
          >
            My Orders
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
