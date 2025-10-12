import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  Search,
  ChevronDown,
  User,
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { reset } from "../features/goals/goalSlice";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSidebarSettingsOpen, setIsSidebarSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Logout
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSidebarSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: FileText, label: "Documents", path: "/documents" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col justify-between p-4 transition-all">
      <div>
        <h1
          className="text-xl font-bold text-blue-600 mb-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          TaskPro
        </h1>

        {/* Navigation Section */}
        <nav className="space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings + Logout */}
      <div className="space-y-2 border-t pt-4">
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSidebarSettingsOpen((prev) => !prev)}
            className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between font-medium transition-all ${
              location.pathname.startsWith("/settings")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings size={16} /> Settings
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                isSidebarSettingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSidebarSettingsOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-full bg-white border rounded-lg shadow-lg z-10 animate-fadeIn">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsSidebarSettingsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  location.pathname === "/profile"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <User size={14} /> Profile Settings
              </button>
              <button
                onClick={() => {
                  navigate("/account");
                  setIsSidebarSettingsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  location.pathname === "/account"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Settings size={14} /> Account Settings
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-100 transition-all"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}

export default Header;
