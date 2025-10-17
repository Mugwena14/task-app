import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalCompletion,
  reset,
} from "../features/goals/goalSlice";
import { Plus, Trash2, Edit3, CheckCircle2, Circle, X } from "lucide-react";
import Spinner from "./Spinner";

function BoardView() {
  const dispatch = useDispatch();
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  );
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    if (isError) console.error(message);
    if (user) dispatch(getGoals());
    return () => dispatch(reset());
  }, [user, dispatch, isError, message]);

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

  const handleToggleComplete = (goal) => {
    dispatch(toggleGoalCompletion({ id: goal._id, completed: !goal.completed }));
  };

  const handleDelete = (goalId) => setGoalToDelete(goalId);

  const confirmDelete = () => {
    if (goalToDelete) {
      dispatch(deleteGoal(goalToDelete));
      setGoalToDelete(null);
    }
  };

  const cancelDelete = () => setGoalToDelete(null);

  const handleEditClick = (goal) => {
    setGoalToEdit(goal);
    setText(goal.text);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Board View</h3>
        <button
          onClick={() => {
            setGoalToEdit(null);
            setText("");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => handleToggleComplete(goal)}
                >
                  {goal.completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-500 flex-shrink-0 mt-1"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-gray-400 hover:text-blue-500 flex-shrink-0 mt-1 transition"
                    />
                  )}
                  <div>
                    <p
                      className={`font-medium text-gray-800 ${
                        goal.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {goal.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(goal.createdAt).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(goal)}
                  className="p-1.5 rounded-md hover:bg-green-100 text-green-600 transition"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No tasks found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setGoalToEdit(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {goalToEdit ? "Edit Task" : "Add New Task"}
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
                {goalToEdit ? "Update Task" : "Add Task"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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

export default BoardView;
