import React, { useState } from "react";
export function AssociateFileUpload({
  busy,
  upload,
}: {
  busy: boolean;
  upload: (file: { name: string; base64: string }) => Promise<void>;
}) {
  const [error, setError] = useState(""),
    [reading, setReading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setReading(true);
        try {
          const file = new FormData(e.currentTarget).get("file") as File;
          if (!file?.size || file.size > 5 * 1024 * 1024)
            throw new Error("Choose a file between 1 byte and 5 MB.");
          if (!/\.(pdf|docx|xlsx|pptx|txt|csv|png|jpe?g)$/i.test(file.name))
            throw new Error("Choose a supported document or image.");
          const base64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result).split(",")[1]);
            r.onerror = () => reject(new Error("Unable to read this file."));
            r.readAsDataURL(file);
          });
          await upload({ name: file.name, base64 });
        } catch (e: any) {
          setError(e.message);
        } finally {
          setReading(false);
        }
      }}
    >
      <label>
        Upload authorised assignment file (up to 5 MB)
        <input
          name="file"
          type="file"
          required
          accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.png,.jpg,.jpeg"
        />
      </label>
      <p>
        Use your organisation’s normal security controls when opening files.
        Automated malware scanning is not connected.
      </p>
      {error && <p role="alert">{error}</p>}
      <button disabled={busy || reading}>
        {reading ? "Uploading…" : "Upload private file"}
      </button>
    </form>
  );
}
