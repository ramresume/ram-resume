import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { IconFileText, IconHistory, IconLoader2, IconX } from "@tabler/icons-react";
import ScanCard from "./ScanCard";

export default function ScanHistory({ setOpen }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.request("/api/scan-history");
        setHistory(response);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] bg-fordham-brown flex items-center justify-center rounded-lg">
        <IconLoader2 className="w-8 h-8 animate-spin text-fordham-white" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-4">
          <IconHistory className="w-6 h-6 text-fordham-white" />
          <h2 className="text-fordham-white text-2xl font-medium">Scan History</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {history?.map((scan) => (
            <ScanButton
              key={scan._id}
              scan={scan}
              onClick={() => {
                setSelectedScan(scan);
                setOpen(true);
              }}
            />
          ))}

          {history?.length === 0 && (
            <div className="min-h-[200px] bg-fordham-brown flex items-center justify-center rounded-lg">
              <p className="text-fordham-light-gray">No scan history available yet.</p>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={selectedScan !== null}
        onClose={() => {
          setSelectedScan(null);
          setOpen(false);
        }}
      >
        {selectedScan && <ScanCard scan={selectedScan} />}
      </Modal>
    </>
  );
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="px-4 fixed inset-0 bg-fordham-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="top-4 md:top-8 bg-fordham-brown rounded-[16px] w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-fordham-white/80 hover:text-fordham-white"
        >
          <IconX className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const ScanButton = ({ scan, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <button
      onClick={onClick}
      className="bg-fordham-brown p-4 rounded-[16px] text-left w-full 
          hover:bg-fordham-white/10 transition-colors duration-200 group"
    >
      <div className="flex items-center gap-4">
        <IconFileText className="w-6 h-6 md:w-8 md:h-8 text-fordham-white mt-1" />
        <div className="flex-1 min-w-0 flex flex-col gap-1 md:gap-2">
          <p className="text-fordham-white font-medium text-base truncate">
            {scan.company.toUpperCase()}
          </p>
          <p className="text-fordham-gray text-xs md:text-sm truncate">{scan.jobTitle}</p>
          <span className="text-fordham-light-gray text-xs md:text-sm">
            {formatDate(scan.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
};
