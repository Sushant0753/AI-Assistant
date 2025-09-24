"use client";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import { uploadDocument } from "@/services/uploadService";

export default function Home() {
  const router = useRouter();

  const handleSend = async (text: string, file: File | null) => {
    const sessionId = crypto.randomUUID();

    let documentId: string | undefined = undefined;
    let filename: string | undefined = undefined;

    if (file) {
      try {
        const uploaded = await uploadDocument(file);
        documentId = uploaded.document_id;
        filename = file.name;
      } catch (err) {
        console.error("Failed to upload attachment!" + err);
      }
    }

    window.sessionStorage.setItem(
      `first-message-${sessionId}`,
      JSON.stringify({ text, documentId, filename })
    );
    router.push(`/chat/${sessionId}/`);
  };

  return (
    <div className="h-screen w-screen bg-dots text-white">
      <main className="ml-16 h-full">
        <div className="h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold text-blue-400 mb-10">How can I help you today?</h1>
          <ChatInput sendUserMessage={handleSend} />
        </div>
      </main>
    </div>
  );
}
