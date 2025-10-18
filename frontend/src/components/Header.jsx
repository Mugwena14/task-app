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
  StickyNote,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { reset } from "../features/goals/goalSlice";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSidebarSettingsOpen, setIsSidebarSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsRef = useRef(null);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSidebarSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: StickyNote, label: "Notes", path: "/notes" },
  ];

  return (
    <>
      {/* ======== Desktop Sidebar ======== */}
      <aside className="hidden md:flex w-64 bg-white shadow-sm flex-col justify-between p-4 transition-all">
        <div>
          <h1
            className="text-xl font-bold text-blue-600 mb-8 cursor-pointer"
            onClick={() => navigate("/")}
          >
            TaskPro
          </h1>

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

      {/* ======== Mobile Header (Top Bar) ======== */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm flex items-center justify-between px-4 py-3 z-50">
        <h1
          onClick={() => navigate("/")}
          className="text-lg font-bold text-blue-600 cursor-pointer"
        >
          TaskPro
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="text-gray-700"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ======== Mobile Blur Overlay ======== */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-white/20 z-30 md:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ======== Mobile Drawer Menu (50% width) ======== */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-1/2 flex flex-col justify-between`}
      >
        {/* Top section (nav) */}
        <div className="p-4 pt-16 flex flex-col space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => {
                  navigate(path);
                  setIsMobileMenuOpen(false);
                }}
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
        </div>

        {/* Bottom section (settings + logout) */}
        <div className="border-t p-4 flex flex-col space-y-2 mb-6">
          <button
            onClick={() => {
              navigate("/profile");
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100"
          >
            <User size={16} /> Profile Settings
          </button>
          <button
            onClick={() => {
              navigate("/account");
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} /> Account Settings
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
