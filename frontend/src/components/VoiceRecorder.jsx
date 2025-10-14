import React, { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";

const VoiceRecorder = ({ user, onRecorded, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Clean up AI-generated text
  const formatGoalText = (text) => {
    if (!text) return "";
    let trimmed = text.trim();
    if (!trimmed) return "";
    // Capitalize first letter
    trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    // Shorten long text
    if (trimmed.length > 100) trimmed = trimmed.slice(0, 97) + "...";
    return trimmed;
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        setIsUploading(true);

        try {
          const res = await fetch("/api/voice", {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
          });

          let data = null;
          try {
            data = await res.json();
          } catch (err) {
            console.error("Failed to parse JSON:", err);
            data = { success: false, message: "Invalid server response" };
          }

          if (res.ok && data?.success) {
            const cleanText = formatGoalText(data.goal.text || "");
            onRecorded?.({ success: true, goal: { text: cleanText } });
          } else {
            console.error("Voice upload failed:", data);
            alert(data?.message || "Failed to process voice. Try again.");
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert("Failed to process voice. Try again.");
        } finally {
          setIsUploading(false);
          onClose?.();
        }
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Please allow microphone access.");
      onClose?.();
    }
  };

  const stopRecording = () => {
    if (recorder && !isUploading) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    startRecording();
    return () => {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full flex items-center gap-4 px-6 py-3 border animate-fadeIn z-50">
      <Mic className={`text-red-500 ${isRecording ? "animate-pulse" : ""}`} />
      <span className="text-gray-700 text-sm font-medium">
        {isRecording ? `Recording... ${formatTime(timer)}` : "Processing..."}
      </span>
      <button
        onClick={stopRecording}
        disabled={isUploading}
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${
          isUploading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        <Square size={14} /> Stop
      </button>
    </div>
  );
};

export default VoiceRecorder;
