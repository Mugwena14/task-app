import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getGoals,
  createGoal,
  deleteGoal,
  reset,
} from "../features/goals/goalSlice";
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
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

        <div className="space-y-2 border-t pt-4">
          <button className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-100 transition-all">
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-100 transition-all"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user && user.name} 👋
          </h2>

          {/* Profile */}
          <div className="relative">
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
                  onClick={() => navigate("/login")}
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
              {/* View Toggle */}
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

              {/* Add Task Button */}
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
                        onClick={() => dispatch(deleteGoal(goal._id))}
                        className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                      >
                        Delete
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

      {/* Modal Form */}
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
    </div>
  );
}

export default Dashboard;
