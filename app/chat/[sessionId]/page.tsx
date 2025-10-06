"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatMessage } from "@/hooks/useChatMessage";
import { ChatMessage } from "@/types/chat";
import ChatInput from "@/components/ChatInput";
import { FiFileText } from "react-icons/fi";
import { MdReplay } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";

export default function ChatPage() {
  const { sessionId } = useParams();
  const { messages, sendUserMessage, containerRef, regenerateMessage } = useChatMessage();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check for a first message (set by Home page)
    const firstMessageKey = `first-message-${sessionId}`;
    const firstMessageRaw = window.sessionStorage.getItem(firstMessageKey);
    if (firstMessageRaw) {
      const { text, documentId, filename } = JSON.parse(firstMessageRaw);
      sendUserMessage(text, null, documentId, filename); // Pass doc info as extra args
      window.sessionStorage.removeItem(firstMessageKey);
    }
  }, [sessionId, sendUserMessage]);

  const copyMessage = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-dots">
      <div
        ref={containerRef}
        className="
          flex-1 overflow-y-auto overflow-x-hidden
          px-2 py-4 space-y-4
          sm:px-4 sm:py-6
          md:pl-32 md:pr-16
          w-full
        "
      >
        {messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}
            w-full`}
          >
            <div
              className={`
                w-full
                max-w-[90%] sm:max-w-[80%] md:max-w-[60%]
                ${msg.isUser ? "" : "space-y-2"}
              `}
            >
              {/* Message content */}
              <div
                className={`
                  rounded-2xl px-4 py-2 shadow break-words inline-block
                  ${msg.isUser
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-neutral-200 inline-block"}
                `}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                {msg.filename && msg.documentId && (
                  <div className="inline-flex items-center gap-2 text-sm text-neutral-200 mt-2 bg-neutral-700 px-2 py-2 rounded-full shadow max-w-48 sm:max-w-64">
                    <FiFileText size={16} className="text-neutral-300" />
                    <span className="truncate flex-1 pr-6">{msg.filename}</span>
                  </div>
                )}
              </div>

              {/* Bot actions in separate div */}
              {!msg.isUser && (
                <>
                  <div className="flex gap-2 pl-2">
                    <button
                      className="bg-transparent hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                      onClick={() => regenerateMessage(msg)}
                      title="Regenerate message"
                    >
                      <MdReplay size={16} />
                    </button>
                    <button
                      className="bg-transparent hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200 p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1"
                      onClick={() => copyMessage(msg.text, msg.id)}
                      title={copiedStates[msg.id] ? "Copied!" : "Copy message"}
                    >
                      {copiedStates[msg.id] ? (
                        <>
                          <LuCheck size={16} />
                          <span className="text-xs">Copied</span>
                        </>
                      ) : (
                        <FaRegCopy size={16} />
                      )}
                    </button>
                  </div>
                  <div className="pl-2 mt-1">
                    <p className="text-xs text-neutral-500 italic">
                      This AI can make mistakes. Please double-check responses.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 sm:p-4">
        <ChatInput sendUserMessage={sendUserMessage} />
      </div>
    </div>
  );
}
