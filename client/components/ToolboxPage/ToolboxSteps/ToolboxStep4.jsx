import Accordion from "@/components/Accordion/Accordion";
import toast from "react-hot-toast";

// This renders Step 4 of the Toolbox which displays the AI recommended resume bullet points
export default function ToolboxStep4({ bulletPoints }) {
  // Transform bulletPoints data for the Accordion
  const accordionData = bulletPoints?.formattedBullets 
    ? bulletPoints.formattedBullets.map((item) => ({
        title: item.company,
        bulletPoints: item.bullets,
      }))
    : [];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-fordham-brown flex flex-col gap-4 h-full">
      {accordionData.length > 0 ? (
        <Accordion data={accordionData} variant="toolbox" onCopy={handleCopy} />
      ) : (
        <div className="text-fordham-light-gray text-center p-4">
          No bullet points available
        </div>
      )}
    </div>
  );
}
