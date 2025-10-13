import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddTaskOptions = ({ open, onClose, onSelect }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>

          {/* Slide-up panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 shadow-lg flex flex-col gap-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
              Add a new task
            </h2>

            <button
              onClick={() => onSelect("voice")}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
            >
              🎙️ Record Task
            </button>

            <button
              onClick={() => onSelect("manual")}
              className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition"
            >
              ✍️ Add Manually
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition mt-2"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskOptions;
