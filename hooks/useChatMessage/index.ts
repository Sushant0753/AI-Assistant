// import { useState, useRef, useEffect } from "react";
// import { ChatMessage } from "@/types/chat";
// import { useChatService } from "@/services/useChatService";

// export function useChatMessage() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const { sendMessage } = useChatService();
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // Auto-scroll when new messages arrive
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const addMessage = (msg: ChatMessage) => {
//     setMessages((prev) => [...prev, msg]);
//   };

//   const sendUserMessage = async (text: string, file: File | null) => {
//     const userMsg: ChatMessage = {
//       id: crypto.randomUUID(),
//       text,
//       isUser: true,
//       timeStamp: Date.now(),
//     };
//     addMessage(userMsg);

//     const botMsgId = crypto.randomUUID();
//     const botMsg: ChatMessage = {
//       id: botMsgId,
//       text: "Thinking...", // placeholder
//       isUser: false,
//       timeStamp: Date.now(),
//     };
//     addMessage(botMsg);

//     let accumulated = "";
//     await sendMessage(
//       text,
//       file,
//       (chunk) => {
//         accumulated += chunk;
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === botMsgId ? { ...m, text: accumulated } : m
//           )
//         );
//       },
//       () => {
//         // Finished streaming
//       }
//     );
//   };

//   return { messages, sendUserMessage, containerRef };
// }

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";

export function useChatMessage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendUserMessage = async (text: string, file: File | null) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      isUser: true,
      timeStamp: Date.now(),
    };
    addMessage(userMsg);

    // Add bot placeholder
    const botMsgId = crypto.randomUUID();
    const botMsg: ChatMessage = {
      id: botMsgId,
      text: "Thinking...", 
      isUser: false,
      timeStamp: Date.now(),
    };
    addMessage(botMsg);

    // Simulate streaming response
    const mockResponse = `You said: "${text}"`;
    let accumulated = "";

    for (let i = 0; i < mockResponse.length; i++) {
      accumulated += mockResponse[i];
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, text: accumulated } : m
        )
      );
      await new Promise((r) => setTimeout(r, 50)); // simulate typing
    }
  };

  return { messages, sendUserMessage, containerRef };
}
