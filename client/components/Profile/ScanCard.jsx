import { useState } from "react";
import { IconFileText, IconTags, IconInfoCircle, IconCopy } from "@tabler/icons-react";
import toast from "react-hot-toast";

const ScanCard = ({ scan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-fordham-brown rounded-[16px] overflow-hidden p-6 md:p-8 flex flex-col gap-10">
      {/* Header Section */}
      <div className="border-b border-fordham-black/20">
        <div className="flex flex-col items-start justify-start mb-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-fordham-white font-bold text-lg">{scan.company.toUpperCase()}</h3>
              <p className="text-fordham-gray text-sm md:text-base font-medium">{scan.jobTitle}</p>
              <span className="text-fordham-light-gray text-sm md:text-base font-medium">
                {formatDate(scan.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-fordham-gray/60">
            <IconTags className="w-4 h-4 md:w-6 md:h-6" />
            <span className="text-sm md:text-base font-medium">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scan.keywords.slice(0, isExpanded ? undefined : 8).map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => handleCopy(keyword)}
                className="px-3 py-1.5 bg-fordham-black hover:bg-fordham-black/80 
                    text-fordham-white text-sm rounded-lg flex items-center gap-2
                    transition-colors duration-200"
              >
                {keyword}
                <IconCopy className="w-4 h-4 opacity-60" />
              </button>
            ))}
            {!isExpanded && scan.keywords.length > 8 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="px-3 py-1.5 bg-fordham-black/50 hover:bg-fordham-black/70
                    text-fordham-gray hover:text-fordham-white text-sm rounded-lg
                    transition-colors duration-200"
              >
                +{scan.keywords.length - 8} more
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Bullets Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-fordham-gray/60">
          <IconInfoCircle className="w-4 h-4 md:w-6 md:h-6" />
          <span className="text-sm md:text-base font-medium">
            Enhanced bullet points for your resume
          </span>
        </div>
        <div className="space-y-6">
          {scan.enhancedBullets.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-fordham-white font-medium">{item.company}</h4>
              <ul className="space-y-2">
                {item.bullets.map((bullet, bulletIdx) => (
                  <li
                    key={bulletIdx}
                    className="group flex items-start gap-2 text-fordham-gray hover:text-fordham-white 
                        transition-colors duration-200 cursor-pointer"
                    onClick={() => handleCopy(bullet)}
                  >
                    <span
                      className="min-w-[8px] h-[8px] mt-2 bg-fordham-gray/40 
                        group-hover:bg-fordham-white rounded-full transition-colors duration-200"
                    />
                    <span className="text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanCard;
