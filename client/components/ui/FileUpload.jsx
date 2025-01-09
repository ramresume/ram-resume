import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { IconUpload, IconX } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

export default function FileUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const api = useApi();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        setError("Please upload a PDF file");
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.request("/api/upload", {
        method: "POST",
        body: formData,
        headers: {},
      });

      console.log("File uploaded:", response);
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <form onSubmit={handleUpload} className="flex flex-col gap-4" onDragEnter={handleDrag}>
        <div
          className={`
            relative flex flex-col items-center justify-center
            border-2 border-dashed border-fordham-white/20 rounded-lg
            p-8 transition-colors
            ${dragActive ? "border-fordham-white bg-fordham-white/5" : ""}
            hover:border-fordham-white/40
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <IconUpload className="w-12 h-12 text-fordham-white/60 mb-4" />

          <p className="text-fordham-white text-center">
            {file ? file.name : "Drag and drop your resume here or click to browse"}
          </p>
          <p className="text-fordham-white/60 text-sm mt-2">PDF files only, up to 10MB</p>
        </div>

        <Button
          type="submit"
          disabled={!file || uploading}
          variant="primary"
          text={uploading ? "Uploading..." : "Upload Resume"}
          className="w-full"
        />

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center gap-2">
            <IconX className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
