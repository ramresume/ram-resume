import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconTag,
} from "@tabler/icons-react";

export const SideBarToolGroup = ({
  activeStep,
  activeGroup,
  groupNumber,
  groupTitle,
  groupSteps,
}) => {
  const groupStepElements = groupSteps.map((step, idx) => (
    <GroupStepItem key={idx} activeStep={activeStep} {...step} />
  ));

  return (
    <div
      className={`${
        activeStep <= groupNumber ? "bg-fordham-white/5" : ""
      } p-4 rounded-[8px] flex flex-col gap-4 transition-all duration-300`}
    >
      <div className="text-fordham-white w-full flex items-center gap-4">
        {activeGroup === groupNumber ? (
          <IconChevronDown className="w-4 font-bold" />
        ) : (
          <IconChevronRight className="w-4 font-bold" />
        )}
        <div
          className={`flex gap-2 body-txt font-bold ${
            activeStep <= groupNumber ? "text-fordham-white" : "text-fordham-gray/60"
          }`}
        >
          <IconTag className="w-4" />
          <p>{groupTitle}</p>
        </div>
      </div>
      {/* Show steps only when in keyword extractor phase */}
      {activeGroup === groupNumber && <div className="flex flex-col gap-4">{groupStepElements}</div>}
    </div>

    // <>
    //   {/* Keyword Extractor */}
    //   <div
    //     className={`${
    //       activeStep <= 2 ? "bg-fordham-white/5" : ""
    //     } p-4 rounded-[8px] flex flex-col gap-4 transition-all duration-300`}
    //   >
    //     <div className="text-fordham-white w-full flex items-center gap-4">
    //       {activeStep <= 2 ? (
    //         <IconChevronDown className="w-4 font-bold" />
    //       ) : (
    //         <IconChevronRight className="w-4 font-bold" />
    //       )}
    //       <div
    //         className={`flex gap-2 body-txt font-bold ${
    //           activeStep <= 2 ? "text-fordham-white" : "text-fordham-gray/60"
    //         }`}
    //       >
    //         <IconTag className="w-4" />
    //         <p>Keyword extractor</p>
    //       </div>
    //     </div>
    //     {/* Show steps only when in keyword extractor phase */}
    //     {activeStep <= 2 && (
    //       <div className="flex flex-col gap-4">
    //         <div className="flex gap-4">
    //           <div
    //             className={`mx-[6px] rounded-full w-1 h-auto ${
    //               activeStep === 1 ? "bg-red-500" : "bg-fordham-gray/40"
    //             }`}
    //           ></div>
    //           <p
    //             className={`body-txt-md ${
    //               activeStep === 1 ? "text-fordham-white" : "text-fordham-gray/60"
    //             }`}
    //           >
    //             Upload job description
    //           </p>
    //         </div>
    //         <div className="flex gap-4">
    //           <div
    //             className={`mx-[6px] rounded-full w-1 h-auto ${
    //               activeStep === 2 ? "bg-red-500" : "bg-fordham-gray/40"
    //             }`}
    //           ></div>
    //           <p
    //             className={`body-txt-md ${
    //               activeStep === 2 ? "text-fordham-white" : "text-fordham-gray/60"
    //             }`}
    //           >
    //             Get keywords
    //           </p>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Resume Enhancer */}
    //   <div
    //     className={`${
    //       activeStep >= 3 && activeStep <= 4 ? "bg-fordham-white/5" : ""
    //     } p-4 rounded-[8px] flex flex-col gap-4 transition-all duration-300`}
    //   >
    //     <div className="text-fordham-white w-full flex items-center gap-4">
    //       {activeStep >= 3 && activeStep <= 4 ? (
    //         <IconChevronDown className="w-4 font-bold" />
    //       ) : (
    //         <IconChevronRight className="w-4 font-bold" />
    //       )}
    //       <div
    //         className={`flex gap-2 body-txt font-bold ${
    //           activeStep >= 3 && activeStep <= 4 ? "text-fordham-white" : "text-fordham-gray/60"
    //         }`}
    //       >
    //         <IconFileText className="w-4" />
    //         <p>Resume enhancer</p>
    //       </div>
    //     </div>
    //     {/* Show steps only when in resume enhancer phase */}
    //     {activeStep >= 3 && activeStep <= 4 && (
    //       <div className="flex flex-col gap-4">
    //         <div className="flex gap-4">
    //           <div
    //             className={`mx-[6px] rounded-full w-1 h-auto ${
    //               activeStep === 3 ? "bg-red-500" : "bg-fordham-gray/40"
    //             }`}
    //           ></div>
    //           <p
    //             className={`body-txt-md ${
    //               activeStep === 3 ? "text-fordham-white" : "text-fordham-gray/60"
    //             }`}
    //           >
    //             Upload resume
    //           </p>
    //         </div>
    //         <div className="flex gap-4">
    //           <div
    //             className={`mx-[6px] rounded-full w-1 h-auto ${
    //               activeStep === 4 ? "bg-red-500" : "bg-fordham-gray/40"
    //             }`}
    //           ></div>
    //           <p
    //             className={`body-txt-md ${
    //               activeStep === 4 ? "text-fordham-white" : "text-fordham-gray/60"
    //             }`}
    //           >
    //             Get bullet points
    //           </p>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Cover letter generator */}
    //   <div
    //     className={`${
    //       activeStep >= 5 ? "bg-fordham-white/5" : ""
    //     } p-4 rounded-[8px] flex flex-col gap-4 transition-all duration-300`}
    //   >
    //     <div className="text-fordham-white w-full flex items-center gap-4">
    //       {activeStep >= 5 ? (
    //         <IconChevronDown className="w-4 font-bold" />
    //       ) : (
    //         <IconChevronRight className="w-4 font-bold" />
    //       )}
    //       <div
    //         className={`flex gap-2 body-txt font-bold ${
    //           activeStep >= 5 ? "text-fordham-white" : "text-fordham-gray/60"
    //         }`}
    //       >
    //         <IconFileText className="w-4" />
    //         <p>Cover letter</p>
    //       </div>
    //     </div>
    //     {/* Show steps only when in cover letter phase */}
    //     {activeStep >= 5 && (
    //       <div className="flex flex-col gap-4">
    //         <div className="flex gap-4">
    //           <div
    //             className={`mx-[6px] rounded-full w-1 h-auto ${
    //               activeStep === 5 ? "bg-red-500" : "bg-fordham-gray/40"
    //             }`}
    //           ></div>
    //           <p
    //             className={`body-txt-md ${
    //               activeStep === 5 ? "text-fordham-white" : "text-fordham-gray/60"
    //             }`}
    //           >
    //             Get cover letter
    //           </p>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </>
  );
};

const GroupStepItem = ({ activeStep, stepTitle, stepNumber }) => (
  <div className="flex gap-4">
    <div
      className={`mx-[6px] rounded-full w-1 h-auto ${
        activeStep === stepNumber ? "bg-red-500" : "bg-fordham-gray/40"
      }`}
    ></div>
    <p
      className={`body-txt-md ${activeStep === 2 ? "text-fordham-white" : "text-fordham-gray/60"}`}
    >
      {stepTitle}
    </p>
  </div>
);
