export async function streamMessage(
  url: string,
  body: FormData,
  onChunk: (chunk: string) => void,
  onFinish: () => void
) {
  const response = await fetch(url, {
    method: "POST",
    body,
  });

  if (!response.ok || !response.body) {
    onChunk("hello how can I help you");
    onFinish();
    return;
  }

  if (!response.body) {
    throw new Error("No response body from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } finally {
    onFinish();
    reader.releaseLock();
  }
}
