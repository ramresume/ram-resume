import Accordion from "@/components/Accordion/Accordion";
import toast from "react-hot-toast";
import { IconCopy } from "@tabler/icons-react";

// This renders Step 4 of the Toolbox which displays the AI recommended resume bullet points
export default function ToolboxStep4({ bulletPoints }) {
  // Transform bulletPoints data for the Accordion component
  // We'll create our own custom implementation instead of using the Accordion
  // to allow for individual bullet point copying
  const formattedBullets = bulletPoints?.formattedBullets || [];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleCopyAllBullets = (company) => {
    const allBullets = company.bullets.join("\n\n");
    navigator.clipboard.writeText(allBullets);
    toast.success(`Copied all bullet points for ${company.company}!`);
  };

  return (
    <div className="bg-fordham-brown flex flex-col gap-6 h-full overflow-y-auto">
      {formattedBullets.length > 0 ? (
        formattedBullets.map((company, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-fordham-white text-base font-bold">{company.company}</h3>
              <button
                onClick={() => handleCopyAllBullets(company)}
                className="p-1 hover:bg-fordham-black/20 rounded flex items-center gap-1 text-fordham-gray hover:text-fordham-white"
              >
                <IconCopy className="w-4 h-4" />
                <span className="text-xs">Copy all</span>
              </button>
            </div>
            <ul className="space-y-3">
              {company.bullets.map((bullet, bulletIdx) => (
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
                  <span className="text-base leading-relaxed flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="text-fordham-light-gray text-center p-4">No bullet points available</div>
      )}
    </div>
  );
}
