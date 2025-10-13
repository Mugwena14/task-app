import React, { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";

const VoiceRecorder = ({ user, onRecorded, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [timer, setTimer] = useState(0);

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

        try {
          const res = await fetch("/api/voice", {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
          });

          const data = await res.json();
          if (res.ok) {
            console.log("✅ Voice task created:", data);
            onRecorded?.(data);
          } else {
            console.error("Voice upload failed:", data);
            alert("Failed to process voice. Try again.");
          }
        } catch (err) {
          console.error("Upload error:", err);
        }
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error("🎙️ Error starting recording:", error);
      alert("Please allow microphone access.");
      onClose?.();
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
      onClose?.();
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
        <Mic className="text-red-500 animate-pulse" />
        <span className="text-gray-700 text-sm font-medium">
        Recording... {formatTime(timer)}
        </span>
        <button
        onClick={stopRecording}
        className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
        >
        <Square size={14} /> Stop
        </button>
    </div>
    );

};

export default VoiceRecorder;
