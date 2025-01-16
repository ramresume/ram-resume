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
  highestCompletedStep,
  groupNumber,
  updateState,
  groupTitle,
  groupSteps,
}) => {
  // handleStepClick assesses wether to update the active step on click if it isn't already active
  const handleStepClick = (stepNumber) => {
    if (stepNumber !== activeStep) {
      console.log("update state");
      updateState({ activeStep: stepNumber });
    }
    return;
  };

  // Map the step items and save them to a variable
  const groupStepElements = groupSteps.map((step, idx) => (
    <StepItem
      key={idx}
      activeStep={activeStep}
      highestCompletedStep={highestCompletedStep}
      handleStepClick={handleStepClick}
      {...step}
    />
  ));

  return (
    <div
      className={`${
        activeGroup === groupNumber ? "bg-fordham-white/5" : ""
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
            activeGroup === groupNumber ? "text-fordham-white" : "text-fordham-gray/60"
          }`}
        >
          <IconTag className="w-4" />
          <p>{groupTitle}</p>
        </div>
      </div>

      {/* Show steps only when in the current group is active */}
      {highestCompletedStep >= groupNumber && (
        <div className="flex flex-col gap-4">{groupStepElements}</div>
      )}
    </div>
  );
};

const StepItem = ({ activeStep, handleStepClick, stepTitle, stepNumber, highestCompletedStep }) => (
  <div
    className={`
      flex gap-4 
      ${highestCompletedStep >= stepNumber ? "hover:cursor-pointer" : "hover:cursor-default"} 
      ${activeStep === stepNumber ? "text-fordham-white" : "text-fordham-gray/60"} 
      ${highestCompletedStep >= stepNumber && "hover:text-fordham-white"}`}
    onClick={() => handleStepClick(stepNumber)}
  >
    <div
      className={`mx-[6px] rounded-full w-1 h-auto ${
        highestCompletedStep >= stepNumber ? "bg-red-500" : "bg-fordham-gray/40"
      }`}
    ></div>
    <p className={`body-txt-md `}>
      {stepTitle}
    </p>
  </div>
);
