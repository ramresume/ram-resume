import { useApi } from "@/hooks/useApi";
import ToolboxForm from "./ToolboxForm";

const toolboxStep1FormData = {
  title: "Paste a job description below...",
  placeholderText:
    "Please paste the full job description here so we can analyze its required skills. To ensure accuracy, include sections detailing roles, responsibilities, and qualifications. Exclude sections like 'About Us/Company,' salary/benefits, and diversity statements, as they typically don't mention hard skills. Only English job descriptions, please.",
  loadingTxt: "Extracting keywords...",
};

// This renders Step 1 of the Toolbox which takes in a job description from the user,
// and queries the server for the suggested resume keywords
export default function ToolboxStep1({
  jobDescription,
  setJobDescription,
  company,
  setCompany,
  jobTitle,
  setJobTitle,
}) {
  const placeholder = `Please paste the full job description here so we can analyze its required skills.

To ensure accuracy, include sections detailing:
• Roles
• Responsibilities
• Qualifications

Exclude sections like:
• About Us/Company
• Salary/benefits
• Diversity statements

as they typically don't mention hard skills. Only English job descriptions, please.`;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="w-full flex flex-row gap-6">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="text-fordham-white text-base font-medium">Company Name</p>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full flex-1 bg-fordham-white/10 text-fordham-white rounded-[8px] 
                placeholder:text-fordham-gray/60 focus:outline-none px-5 py-3 
                border-transparent focus:ring-0"
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <p className="text-fordham-white text-base font-medium">Job Title</p>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full flex-1 bg-fordham-white/10 text-fordham-white rounded-[8px] 
                placeholder:text-fordham-gray/60 focus:outline-none px-5 py-3 
                border-transparent focus:ring-0"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 h-full">
        <p className="text-fordham-white text-base font-medium">Job Description</p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={placeholder}
          className="w-full flex-1 bg-fordham-brown text-fordham-white rounded-[8px] placeholder:text-fordham-gray/60 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
