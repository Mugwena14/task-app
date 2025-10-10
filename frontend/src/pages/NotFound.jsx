import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertTriangle size={64} className="text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600 text-lg">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
