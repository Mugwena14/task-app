import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();
  const [isSidebarSettingsOpen, setIsSidebarSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Logout function
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSidebarSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col justify-between p-4 transition-all">
      <div>
        <h1 className="text-xl font-bold text-blue-600 mb-8">TaskPro</h1>
        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Search, label: "Search" },
            { icon: FileText, label: "Documents" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Settings + Logout */}
      <div className="space-y-2 border-t pt-4">
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSidebarSettingsOpen((prev) => !prev)}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-gray-700 font-medium hover:bg-gray-100 transition-all"
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
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                <User size={14} /> Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
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
