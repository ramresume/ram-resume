import { useState, useEffect } from "react";
import { IconUpload, IconFile, IconX, IconDownload, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { useApi } from "@/hooks/useApi";

export default function ResumeModal({ active, setActive, onResumeUpdate }) {
  const [showUpload, setShowUpload] = useState(false);
  const [resume, setResume] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const api = useApi();

  const fetchResume = async () => {
    try {
      const response = await api.request("/api/files");
      setResume(response[0]);
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const fetchPdf = async () => {
    if (!resume) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/files/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    fetchResume();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  useEffect(() => {
    if (resume) fetchPdf();
  }, [resume]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/files/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume?.filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDeleteResume = async () => {
    if (!resume) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/files/${resume._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Clear state
      setResume(null);
      setPdfUrl(null);
      
      // Notify parent component if needed
      if (onResumeUpdate) {
        onResumeUpdate();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchResume();
    if (onResumeUpdate) {
      onResumeUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-fordham-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-fordham-brown rounded-[16px] p-6 w-full max-w-3xl h-fit relative">
        <button
          onClick={() => setActive(false)}
          className="absolute top-6 right-6 text-fordham-white/80 hover:text-fordham-white"
        >
          <IconX className="w-6 h-6" />
        </button>

        <h2 className="text-fordham-white text-2xl font-medium mb-6">Resume</h2>

        {showUpload ? (
          <div className="flex flex-col justify-center items-center h-fit">
            <div className="bg-fordham-white/10 rounded-[16px] p-4 mb-6 flex items-start gap-3">
              <IconInfoCircle className="text-fordham-white/80 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-fordham-white/80 text-sm">
                <p className="mb-2">
                  While resumes are now more widely accessible and are not considered entirely private, we advise against sharing sensitive personal information in your resume.
                </p>
                <p>
                  Please note that we use OpenAI GPT API for processing, and your resume is not being used to train the model or for any other purpose beyond the intended service.
                </p>
              </div>
            </div>
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {resume && (
              <div className="bg-fordham-white/10 rounded-[16px] p-6">
                <div className="flex items-center gap-4">
                  <IconFile className="w-8 h-8 text-fordham-white" />
                  <div className="flex-1">
                    <h3 className="text-fordham-white font-medium">{resume.filename}</h3>
                    <p className="text-fordham-white/60 text-sm">
                      {formatFileSize(resume.size)} • Uploaded {formatDate(resume.uploadDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-fordham-white/10 rounded-lg"
                      title="Download resume"
                    >
                      <IconDownload className="w-6 h-6 text-fordham-white" />
                    </button>
                    <button
                      onClick={handleDeleteResume}
                      className="p-2 hover:bg-red-500/20 rounded-lg"
                      disabled={isDeleting}
                      title="Delete resume"
                    >
                      <IconTrash className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 rounded-[16px] h-fit overflow-hidden gap-6 flex flex-col">
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-[50vh]" title="Resume Preview" />
              ) : (
                <div className="flex items-center justify-center h-fit py-20 text-fordham-white/60">
                  No resume uploaded
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              icon={<IconUpload />}
              text="Upload New Resume"
              onClick={() => setShowUpload(true)}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
