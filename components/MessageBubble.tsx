"use client"
import { Message } from "@/app/types";

export default function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
  );
}
