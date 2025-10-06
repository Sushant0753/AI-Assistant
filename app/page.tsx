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
      <main className="h-full flex flex-col items-center justify-center px-2 sm:px-4 md:ml-16">
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-6 sm:mb-10 text-center">
          How can I help you today?
        </h1>
        <ChatInput sendUserMessage={handleSend} />
      </main>
    </div>
  );
}
