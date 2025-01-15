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
