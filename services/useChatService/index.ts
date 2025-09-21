import { streamMessage } from "@/utils/streamMessage";

export function useChatService() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const sendMessage = async (
    message: string,
    file: File | null,
    onStream: (chunk: string) => void,
    onFinish: () => void
  ) => {
    const formData = new FormData();
    formData.append("query", message);
    if (file) formData.append("file", file);

    await streamMessage(`${BACKEND_URL}/chat`, formData, onStream, onFinish);
  };

  return { sendMessage };
}
