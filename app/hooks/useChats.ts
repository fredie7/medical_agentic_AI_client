"use client";

// Import dependencies
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../types";

export function useChat() {
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Upon page mount, assign/retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("session_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("session_id", id);
    }
    setSessionId(id);
  }, []);

  // Handle user requests to the backend and update chat history
  const handleAsk = async () => {
    if (!message.trim()) return;
    setLoading(true);
    // Create a new message for the user and append it to the history
    const newHistory: Message[] = [...history, { role: "user", content: message }];

    // Send a request to the backend API
    try {
      const res = await fetch("https://medical-agentic-ai.onrender.com/ask", {
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

  return {
    message,
    setMessage,
    history,
    loading,
    inputRef,
    chatEndRef,
    handleAsk,
  };
}
