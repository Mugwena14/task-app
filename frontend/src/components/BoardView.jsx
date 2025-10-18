import React from "react";
import { Circle, CheckCircle2, Edit3, Trash2 } from "lucide-react";

function BoardView({ goals, handleToggleComplete, handleEditClick, handleDeleteClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {goals.length > 0 ? (
        goals.map((goal) => (
          <div
            key={goal._id}
            className="bg-gray-50 shadow-sm rounded-lg p-4 flex flex-col justify-between"
          >
            {/* Task text with completion tick */}
            <div className="flex items-center gap-3 mb-2 cursor-pointer">
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
              <p className="font-medium text-gray-800">{goal.text}</p>
            </div>

            {/* Creation date */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{new Date(goal.createdAt).toLocaleDateString("en-US")}</span>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              {/* Desktop buttons */}
              <button
                onClick={() => handleEditClick(goal)}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 hidden md:flex"
                aria-label="Edit task"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDeleteClick(goal._id)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hidden md:flex"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>

              {/* Mobile buttons */}
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
        <p className="text-gray-500 text-sm col-span-full">
          You have not set any goals.
        </p>
      )}
    </div>
  );
}

export default BoardView;
