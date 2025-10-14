import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
    LogOut,
    Settings,
    ChevronDown,
    User,
    Plus,
    X,
    Edit3,
    Trash2,
    StickyNote,
    Save,
} from "lucide-react";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

function Notes() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [notes, setNotes] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteToDelete, setNoteToDelete] = useState(null);
    const dropdownRef = useRef(null);

    // Logout
    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Add or edit a note
    const handleSaveNote = (e) => {
        e.preventDefault();
        if (!noteTitle.trim() || !noteContent.trim()) return;

        if (editingNote) {
        setNotes((prev) =>
            prev.map((n) =>
            n.id === editingNote.id
                ? { ...n, title: noteTitle, content: noteContent }
                : n
            )
        );
        } else {
        setNotes((prev) => [
            ...prev,
            {
            id: Date.now(),
            title: noteTitle,
            content: noteContent,
            date: new Date().toISOString(),
            },
        ]);
        }

        setNoteTitle("");
        setNoteContent("");
        setEditingNote(null);
        setIsModalOpen(false);
    };

    // Edit
    const handleEdit = (note) => {
        setEditingNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = (id) => setNoteToDelete(id);
    const confirmDelete = () => {
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));
        setNoteToDelete(null);
    };

    if (!user) {
        navigate("/login");
        return <Spinner />;
    }

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Header />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">My Notes 📝</h2>

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

        {/* Notes Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Your Notes
            </h3>
            <button
              onClick={() => {
                setEditingNote(null);
                setNoteTitle("");
                setNoteContent("");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <Plus size={16} /> New Note
            </button>
          </div>

          {/* Notes List */}
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-50 shadow-sm rounded-xl p-4 flex flex-col justify-between transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StickyNote size={18} className="text-purple-500" />
                      <h4 className="font-medium text-gray-800">
                        {note.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <p>{new Date(note.date).toLocaleString("en-US")}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 hover:bg-gray-200 rounded-md"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1 hover:bg-gray-200 rounded-md text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              You haven’t written any notes yet.
            </p>
          )}
        </div>
      </main>

      {/* Modal for New/Edit Note */}
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
              {editingNote ? "Edit Note" : "New Note"}
            </h2>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <input
                type="text"
                placeholder="Note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Save size={16} /> {editingNote ? "Update Note" : "Save Note"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete this note?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setNoteToDelete(null)}
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

export default Notes;
