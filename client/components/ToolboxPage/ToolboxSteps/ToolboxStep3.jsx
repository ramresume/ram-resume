import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { IconFile, IconUpload, IconX, IconAlertCircle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import ResumeModal from "@/components/Profile/ResumeModal";

export default function ToolboxStep3({ resume, setResume, error, setError }) {
  const [uploadedResume, setUploadedResume] = useState(null);
  const [resumeModalActive, setResumeModalActive] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);
  const api = useApi();

  const placeholder = `Please paste the full resume here so we can analyze the skills and experience listed.

To ensure accuracy, include sections detailing:
• Work history
• Job titles
• Responsibilities
• Education

Exclude sections like:
• Personal statements
• Hobbies
• References

as they typically don't highlight specific skills. Only resumes in English, please.`;

  const fetchResume = useCallback(async () => {
    try {
      const response = await api.request("/api/files");
      if (response?.[0]) {
        const pdfResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/files/download`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            credentials: "include",
          }
        );

        if (!pdfResponse.ok) {
          throw new Error(`HTTP error! status: ${pdfResponse.status}`);
        }

        const blob = await pdfResponse.blob();
        // Convert blob to File object with proper name for FormData compatibility
        const file = new File([blob], response[0].filename, { type: "application/pdf" });
        setUploadedResume(file);
        setResumeInfo(response[0]);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError("Failed to fetch resume. Please try again.");
    }
  }, [setError]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  function handleResumeUpdate() {
    setError("");
    fetchResume();
  }

  const handleExtractText = async () => {
    if (uploadedResume) {
      try {
        setError("");
        const formData = new FormData();
        formData.append("file", uploadedResume);

        const extractResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/extract-text`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            credentials: "include",
          }
        );

        if (!extractResponse.ok) {
          const errorData = await extractResponse.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Text extraction failed with status ${extractResponse.status}`;
          setError(errorMessage);
          throw {
            response: {
              status: extractResponse.status,
              data: errorData,
            },
            message: errorMessage,
          };
        }

        const data = await extractResponse.json();
        setResume(data.text.trim());
      } catch (error) {
        console.error("Error extracting text:", error);
        setError(error.message || "Failed to extract text from resume");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {uploadedResume && (
        <div className="bg-fordham-black/30 p-4 rounded-[8px] flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <IconFile className="w-6 h-6 text-fordham-gray/60" />
            <p className="text-fordham-white">
              Uploaded resume: <span className="italic">{resumeInfo.filename}</span>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="tertiary"
              text="View resume"
              onClick={() => setResumeModalActive(true)}
              className="w-auto"
            />
            <Button
              variant="primary"
              text="Use this resume"
              onClick={handleExtractText}
              className="w-auto"
            />
          </div>
          {resumeModalActive && (
            <ResumeModal
              active={resumeModalActive}
              setActive={setResumeModalActive}
              onResumeUpdate={handleResumeUpdate}
            />
          )}
        </div>
      )}
      <textarea
        value={resume}
        onChange={(e) => {
          setResume(e.target.value);
          setError("");
        }}
        placeholder={placeholder}
        className={`w-full flex-1 p-4 bg-fordham-brown text-fordham-white rounded-[8px] placeholder:text-fordham-gray/60 focus:outline-none resize-none
          ${error ? "border border-red-500" : ""}`}
      />
    </div>
  );
}
