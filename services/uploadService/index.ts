export type UploadResult = {
  document_id: string;
  [key: string]: unknown;
};

export async function uploadDocument(file: File): Promise<UploadResult> {
  const ALLOWED_TYPES = process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES
    ? process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES.split(",").map(type => type.trim())
    : [];
   
  const MAX_FILE_SIZE_MB = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB
    ? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB, 10)
    : 10;

  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  if (!file) {
    throw new Error("No file selected for upload");
  }

  if (ALLOWED_TYPES.length > 0 && !ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type "${file.type}" not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);

  const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;
  
  if (!UPLOAD_URL) {
    throw new Error("Upload URL not configured");
  }

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const result: { id: string; [key: string]: unknown } = await response.json();
  return { document_id: result.id, ...result };
}
