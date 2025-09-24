import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { useChatService } from "@/services/useChatService";
import { uploadDocument } from "@/services/uploadService";

export function useChatMessage(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const { sendMessage } = useChatService();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendUserMessage = async (
    text: string,
    file: File | null,
    preUploadedDocumentId?: string,
    preUploadedFilename?: string
  ) => {
    let documentId: string | undefined = preUploadedDocumentId;
    let filename: string | undefined = preUploadedFilename;

    if (file && !preUploadedDocumentId) {
      try {
        const uploaded = await uploadDocument(file);
        documentId = uploaded.document_id;
        filename = file.name;
      } catch (err) {
        console.error("Document upload failed:", err);
        return;
      }
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      isUser: true,
      timeStamp: Date.now(),
      ...(documentId ? { documentId } : {}),
      ...(filename ? { filename } : {}),
    };
    addMessage(userMsg);

    const botMsgId = crypto.randomUUID();
    const botMsg: ChatMessage = {
      id: botMsgId,
      text: "Thinking...",
      isUser: false,
      timeStamp: Date.now(),
    };
    addMessage(botMsg);

    let accumulated = "";
    await sendMessage(
      text,
      documentId,
      (chunk: string) => {
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: accumulated } : m))
        );
      },
      () => {}
    );
  };

  const regenerateMessage = (msg: ChatMessage) => {
    if (!msg.isUser) {
      // Find the related user message
      const relatedUserMsg = messages.find(
        (m) =>
          m.isUser &&
          (m.documentId === msg.documentId || m.text === msg.text)
      );

      if (relatedUserMsg) {
        // Send a new bot response for the same user input
        sendUserMessage(
          relatedUserMsg.text,
          null,
          relatedUserMsg.documentId,
          relatedUserMsg.filename
        );
      }
    }
  };


  return { messages, sendUserMessage, containerRef, regenerateMessage };
}
