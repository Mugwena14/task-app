

function BoardView() {


    if (isLoading) return <Spinner />;

    return (
        <>


            {/* Task List */}
            {tasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div
                    key={note._id}
                    className="bg-gray-50 shadow-sm rounded-xl p-4 flex flex-col justify-between transition hover:shadow-md"
                    >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                        <StickyNote size={18} className="text-purple-500" />
                        <h4 className="font-medium text-gray-800">{note.title}</h4>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                        {note.summary || note.content}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <p>{new Date(note.createdAt).toLocaleString("en-US")}</p>
                        <div className="flex gap-2">
                        {!note.summary ? (
                            <button
                            onClick={() => handleSummarize(note)}
                            className="p-1 hover:bg-gray-200 rounded-md text-purple-600 flex items-center gap-1"
                            disabled={loadingNoteId === note._id}
                            >
                            {loadingNoteId === note._id ? (
                                <span className="animate-pulse">Summarizing...</span>
                            ) : (
                                <>
                                <Sparkles size={14} /> Summarize
                                </>
                            )}
                            </button>
                        ) : (
                            <button
                            onClick={() => handleRestoreOriginal(note)}
                            className="p-1 hover:bg-gray-200 rounded-md text-green-600 flex items-center gap-1"
                            disabled={loadingNoteId === note._id}
                            >
                            <RotateCcw size={14} /> Original
                            </button>
                        )}
                        <button
                            onClick={() => handleEdit(note)}
                            className="p-1 hover:bg-gray-200 rounded-md"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={() => handleDelete(note._id)}
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
                <p className="text-gray-500 text-sm">You haven’t written any notes yet.</p>
            )}

        </>
    );
}

export default BoardView;
