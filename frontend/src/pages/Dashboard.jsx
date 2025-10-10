import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getGoals,
  createGoal,
  deleteGoal,
  reset,
} from "../features/goals/goalSlice";
import { logout } from "../features/auth/authSlice"; // ✅ Correct import
import Spinner from "../components/Spinner";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Search,
  FileText,
  ChevronDown,
  User,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import Header from '../components/Header'

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarSettingsOpen, setIsSidebarSettingsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [goalToDelete, setGoalToDelete] = useState(null); // ✅ track goal for confirmation

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  // ✅ Logout function
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isError) console.error(message);
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getGoals());
    }
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch(createGoal({ text }));
    setText("");
    setIsModalOpen(false);
  };

  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId); 
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      dispatch(deleteGoal(goalToDelete));
      setGoalToDelete(null);
    }
  };

  const cancelDelete = () => {
    setGoalToDelete(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}

      <Header />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user && user.name} 👋
          </h2>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white border rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "example@email.com"}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 animate-fadeIn">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                  <User size={14} /> View Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                  <Settings size={14} /> Account Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    view === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setView("board")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    view === "board"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Board
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          </div>

          {/* Task List */}
          {view === "list" ? (
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div
                    key={goal._id}
                    className="bg-gray-50 shadow-sm rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{goal.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(goal.createdAt).toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal._id)}
                        className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  You have not set any goals.
                </p>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Board view coming soon...</div>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Task
            </h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your task..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete this task?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
