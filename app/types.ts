// Define the Message type for chat messages to structure the chat history
// Each message has a role (user or assistant) and content (text of the message) for accurate rendering

export type Message = {
  role: "user" | "assistant";
  content: string;
};
