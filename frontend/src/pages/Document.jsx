import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  reset,
} from "../features/documents/documentSlice";
import { logout } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import {
  LogOut,
  Settings,
  ChevronDown,
  User,
  Plus,
  X,
  Trash2,
  FileText,
  Download,
} from "lucide-react";
import Header from "../components/Header";

function Documents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { documents, isLoading, isError, message } = useSelector(
    (state) => state.documents
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const dropdownRef = useRef(null);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isError) console.error(message);
    if (!user) navigate("/login");
    else dispatch(getDocuments());
    return () => dispatch(reset());
  }, [user, navigate, isError, message, dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    dispatch(uploadDocument(selectedFile));
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id) => setDocumentToDelete(id);

  const confirmDelete = () => {
    if (documentToDelete) {
      dispatch(deleteDocument(documentToDelete));
      setDocumentToDelete(null);
    }
  };

  const cancelDelete = () => setDocumentToDelete(null);

  const handleDownload = async (doc) => {
    const token = user?.token;
    const response = await fetch(`/api/documents/${doc._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = doc.filename || "download";
    link.click();
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-100 overflow-hidden">
      <Header />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto mt-16 md:mt-0">
        {/* ===== Header Section ===== */}
        <div className="bg-white rounded-2xl shadow-sm px-4 md:px-6 py-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            My Documents 📂
          </h2>

          <div className="relative" ref={dropdownRef}>
            {/* Desktop full view */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hidden md:flex items-center gap-3 bg-white border rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all"
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

            {/* Mobile avatar only */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex md:hidden items-center justify-center rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
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

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Uploaded Files
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto"
            >
              <Plus size={16} /> Upload File
            </button>
          </div>

          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-50 shadow-sm rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <FileText size={24} className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">{doc.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadDate).toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition flex items-center gap-1"
                    >
                      <Download size={14} /> Download
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doc._id)}
                      className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              You haven’t uploaded any documents yet.
            </p>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Upload Document
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete this document?
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

export default Documents;
