"use client";

// Import dependencies
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import med6 from "../images/med6.jpeg";

// Define the Message type for chat messages to structure the chat history
// Each message has a role (user or assistant) and content (text of the message) for accurate rendering
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  // State variables to manage chat messages, history, and loading state
  // `message` is the current input from the user
  // `history` is the array of messages exchanged in the chat
  // `loading` indicates if the app is waiting for a response from the backend
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Focus the input field upon component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  //Ensure the chat view always shows the latest messages once history changes
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // On mount, assign/retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("session_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("session_id", id);
    }
    setSessionId(id);
  }, []);

  // Scroll to the bottom of the chat when new messages are added
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle user requests to the backend and update chat history
  const handleAsk = async () => {
    if (!message.trim()) return;
    setLoading(true);

    // Create a new message for the user and append it to the history
    const newHistory: Message[] = [...history, { role: "user", content: message }];

    // Send a request to the backend API
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: sessionId, // Pass session ID for individualized chatting experience
        }),
      });

      // Handle the response from the backend
      const data = await res.json();

      // Update the state
      setHistory([
        ...newHistory,
        { role: "assistant", content: data.response || "No response." },
      ]);
      setMessage("");
    } catch (error) {
      setHistory([
        ...newHistory,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Render application's interface
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image src={med6} alt="Background" fill className="object-cover" priority />
      </div>

      {/* Dark Transparent Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10 pointer-events-none" />

      <div className="w-full max-w-2xl p-4 sm:p-6 rounded-lg shadow-lg bg-white bg-opacity-90 mt-10 mb-28 sm:mb-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-4 sm:mb-6">
          <div className="text-indigo-700 bg-white rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] px-4 sm:px-6 py-2 sm:py-3 text-2xl sm:text-4xl font-bold text-center">
            SymptoCare
          </div>

          <div
            className="text-emerald-600 text-xl sm:text-2xl mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {history.length === 0
              ? "How are you feeling today?"
              : "Let's keep the conversation going..."}
          </div>
        </h1>

        <div className="space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`break-words max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Stick Input Bar to Bottom */}
      <div className="fixed bottom-0 w-full bg-black border-t border-gray-700 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row max-w-2xl mx-auto items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <textarea
            ref={inputRef}
            rows={1}
            className="flex-1 bg-white text-black border border-gray-300 rounded-lg resize-none px-3 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe your symptoms..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className={`h-12 px-4 sm:px-5 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Wait a second..." : "Talk to me"}
          </button>
        </div>
      </div>
    </main>
  );
}
