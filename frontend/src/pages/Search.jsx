import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Search, Loader2, XCircle, CheckCircle2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return setError("Please enter a search term.");

    setLoading(true);
    setError(null);
    setResults(null);
    setSummary(null);

    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data.results);
      setSummary(res.data.aiSummary);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Header />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Smart Search</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition"
          >
            ← Back
          </button>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-50 rounded-full border px-4 py-2"
          >
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search your notes, goals, or documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-800"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            )}
            <button
              type="submit"
              className="ml-3 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Search"}
            </button>
          </form>

          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 bg-white border rounded-xl shadow-sm p-6 space-y-5"
              >
                {/* AI Summary */}
                {summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">{summary}</p>
                  </div>
                )}

                {/* Results */}
                <div>
                  {results.goals?.length > 0 && (
                    <>
                      <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Goals
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-gray-600">
                        {results.goals.map((g) => (
                          <li key={g._id}>{g.text}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {results.notes?.length > 0 && (
                    <>
                      <h3 className="font-semibold text-gray-700 mt-3 mb-1 flex items-center gap-1">
                        Notes
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-gray-600">
                        {results.notes.map((n) => (
                          <li key={n._id}>{n.text}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {results.documents?.length > 0 && (
                    <>
                      <h3 className="font-semibold text-gray-700 mt-3 mb-1 flex items-center gap-1">
                        <FileText size={16} /> Documents
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-gray-600">
                        {results.documents.map((d) => (
                          <li key={d._id}>
                            <span className="font-medium">{d.title}</span> –{" "}
                            <span className="text-gray-500 text-sm">
                              {d.content?.slice(0, 100)}...
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {results.goals?.length === 0 &&
                    results.notes?.length === 0 &&
                    results.documents?.length === 0 && (
                      <p className="text-sm text-gray-500">No matches found.</p>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        </div>
      </main>
    </div>
  );
}

export default SearchPage;
