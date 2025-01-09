import { useState } from "react";
import { useRouter } from "next/router";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "@/components/ui/FileUpload";
import toast from "react-hot-toast";

export default function Onboarding() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [step, setStep] = useState(1);

  // Remove router.push from onSubmitSuccess and pass handleNext directly
  const handleNext = () => {
    setStep(2);
  };

  const handleResumeSuccess = () => {
    router.push("/profile");
    toast.success("Onboarding completed!");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PageContainer marginBottom={true}>
      <GradientContainer>
        <div className="w-full flex flex-col items-center gap-2 py-20 px-6 md:px-10">
          <div className="max-w-3xl text-center">
            <h1 className="h4 md:h2 text-fordham-white mb-4">
              {step === 1 ? "Complete Your Profile" : "Add Your Resume"}
            </h1>
            <p className="body-txt-sm md:body-txt-md text-center font-light text-fordham-light-gray/60 max-w-2xl mx-auto">
              {step === 1
                ? "Help us personalize your experience and match you with the right opportunities"
                : "Add your resume to get personalized job recommendations"}
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-fordham-white" : "bg-fordham-white/30"}`}
            />
            <div
              className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-fordham-white" : "bg-fordham-white/30"}`}
            />
          </div>
        </div>

        <div className="shadow-lg w-full max-w-2xl mx-auto flex flex-col items-center gap-6 bg-fordham-white/10 rounded-[16px] p-6">
          {step === 1 ? (
            <ProfileEditForm
              initialData={user}
              mode="onboarding"
              onSubmitSuccess={handleNext}
              onLogout={handleLogout}
            />
          ) : (
            <FileUpload onSuccess={handleResumeSuccess} />
          )}
        </div>
      </GradientContainer>
    </PageContainer>
  );
}
