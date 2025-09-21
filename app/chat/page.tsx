"use client";

import { useChatMessage } from "@/hooks/useChatMessage";
import { FiRefreshCcw, FiCopy } from "react-icons/fi";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import ProfileIcon from "@/components/ProfileIcon";

export default function ChatPage() {
  const { messages, sendUserMessage, containerRef } = useChatMessage();

  // Regenerate a bot message
  const handleRegenerate = (msg: string) => {
    sendUserMessage(msg, null);
  };

  // Copy message text to clipboard
  const handleCopy = (msg: string) => {
    navigator.clipboard.writeText(msg);
  };

  return (
    <div className="flex flex-col h-screen bg-dots">
    <Sidebar />
    <ProfileIcon />

      {/* Chat messages container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-7xl items-center mx-auto w-full"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-lg shadow ${
                msg.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Show buttons only for bot messages */}
              {!msg.isUser && (
                <div className="flex gap-3 mt-2 text-xs text-neutral-400">
                  <button
                    title="Regenerate response"
                    aria-label="Regenerate response"
                    onClick={() => handleRegenerate(msg.text)}
                    className="flex items-center gap-1 hover:text-white cursor-pointer"
                  >
                    <FiRefreshCcw size={14} />
                  </button>
                  <button
                    title="Copy message"
                    aria-label="Copy message"
                    onClick={() => handleCopy(msg.text)}
                    className="flex items-center gap-1 hover:text-white cursor-pointer"
                  >
                    <FiCopy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="p-4">
        {/* Pass sendUserMessage from hook */}
        <ChatInput sendUserMessage={sendUserMessage} />
      </div>
    </div>
  );
}
