import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalCompletion,
  reset,
} from "../features/goals/goalSlice";
import { logout } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import {
  LogOut,
  Settings,
  User,
  Plus,
  Trash2,
  Circle,
  CheckCircle2,
  X,
  Save,
  List,
  LayoutGrid,
  Edit3,
} from "lucide-react";
import Header from "../components/Header";
import AddTaskOptions from "../components/AddTaskOptions";
import VoiceRecorder from "../components/VoiceRecorder";
import BoardView from "../components/BoardView";

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
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isError) console.error(message);
    if (!user) navigate("/login");
    else dispatch(getGoals());
    return () => dispatch(reset());
  }, [user, navigate, isError, message, dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    if (goalToEdit) {
      dispatch(updateGoal({ id: goalToEdit._id, text }));
      setGoalToEdit(null);
    } else {
      dispatch(createGoal({ text }));
    }
    setText("");
    setIsModalOpen(false);
  };

  const handleEditClick = (goal) => {
    setGoalToEdit(goal);
    setText(goal.text);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (goalId) => setGoalToDelete(goalId);
  const confirmDelete = () => {
    if (goalToDelete) {
      dispatch(deleteGoal(goalToDelete));
      setGoalToDelete(null);
    }
  };
  const cancelDelete = () => setGoalToDelete(null);

  const handleToggleComplete = (goal) => {
    dispatch(toggleGoalCompletion({ id: goal._id, completed: !goal.completed }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Header />

      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-y-auto">
        {/* ===== Top Section ===== */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-3 mb-6 flex justify-between items-center">
          {/* Desktop View */}
          <h2 className="text-2xl font-semibold text-gray-800 hidden md:block">
            Welcome back, {user?.name} 👋
          </h2>

          {/* Mobile View */}
          <h2 className="text-base font-semibold text-gray-800 md:hidden">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Desktop full view */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hidden md:flex items-center gap-3 bg-white border shadow-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "example@email.com"}
                </p>
              </div>
            </button>

            {/* Mobile minimal avatar only */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex md:hidden rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 animate-fadeIn md:mt-2 md:right-0">
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

        {/* ===== Tasks Section ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
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
                onClick={() => setShowTaskOptions(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden gap-3">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg border ${
                  view === "list" ? "bg-blue-600 text-white" : "text-gray-700"
                }`}
                aria-pressed={view === "list"}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setView("board")}
                className={`p-2 rounded-lg border ${
                  view === "board" ? "bg-blue-600 text-white" : "text-gray-700"
                }`}
                aria-pressed={view === "board"}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setShowTaskOptions(true)}
                className="p-2 rounded-lg bg-blue-600 text-white"
                aria-label="Add task"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* ===== Task List / Board ===== */}
          {view === "list" ? (
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div
                    key={goal._id}
                    className="bg-gray-50 shadow-sm rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => handleToggleComplete(goal)}
                        className="transition-transform hover:scale-110"
                      >
                        {goal.completed ? (
                          <CheckCircle2
                            size={22}
                            className="text-green-500 transition-all duration-200"
                          />
                        ) : (
                          <Circle
                            size={22}
                            className="text-gray-400 hover:text-blue-500 transition-all duration-200"
                          />
                        )}
                      </div>

                      <div>
                        <p
                          className={`font-medium text-gray-800 ${
                            goal.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {goal.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(goal.createdAt).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Desktop Buttons */}
                      <button
                        onClick={() => handleEditClick(goal)}
                        className="hidden md:flex items-center gap-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition"
                        aria-label="Edit task"
                      >
                        <Edit3 size={14} /> <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal._id)}
                        className="hidden md:flex items-center gap-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                        aria-label="Delete task"
                      >
                        <Trash2 size={14} /> <span>Delete</span>
                      </button>

                      {/* Mobile Buttons */}
                      <button
                        onClick={() => handleEditClick(goal)}
                        className="md:hidden p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                        aria-label="Edit task"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal._id)}
                        className="md:hidden p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
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
            <BoardView
              goals={goals}
              handleToggleComplete={handleToggleComplete}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          )}
        </div>

        {/* ===== Modals and Extras ===== */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                {goalToEdit ? "Edit Task" : "Add Task"}
              </h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <Save size={16} /> {goalToEdit ? "Save" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {goalToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this task?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <AddTaskOptions
          open={showTaskOptions}
          onClose={() => setShowTaskOptions(false)}
          onSelect={(option) => {
            setShowTaskOptions(false);
            if (option === "manual") {
              setGoalToEdit(null);
              setText("");
              setIsModalOpen(true);
            } else if (option === "voice") {
              setShowRecorder(true);
            }
          }}
        />

        {showRecorder && (
          <VoiceRecorder
            user={user}
            onRecorded={() => dispatch(getGoals())}
            onClose={() => setShowRecorder(false)}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
