"use client";

import Image from "next/image";
import med6 from "../images/med6.jpeg";
import MessageBubble from "./MessageBubble";
import { useChat } from "@/app/hooks/useChats";


export default function Chat() {
  const {
    message,
    setMessage,
    history,
    loading,
    inputRef,
    chatEndRef,
    handleAsk,
  } = useChat();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image src={med6} alt="Background" fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-black/50 -z-10 pointer-events-none" />

      {/* Chat Box */}
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
            <MessageBubble key={idx} msg={msg} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
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
