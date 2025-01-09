import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import {
  IconFile,
  IconInfoCircle,
  IconLoader2,
  IconLogout,
  IconPencil,
  IconTrophy,
  IconUpload,
} from "@tabler/icons-react";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import { useApi } from "@/hooks/useApi";
import ResumeModal from "@/components/Profile/ResumeModal";

export default function Profile() {
  const { user, loading, logout, usage, checkUsage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const router = useRouter();
  const api = useApi();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    // Lock body scroll when modal is open
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [user, loading, router, isEditing]);

  async function getResume() {
    const resume = await api.request("/api/files");
    setResume(resume);
    console.log(resume);
  }

  useEffect(() => {
    checkUsage();
    getResume();
  }, [checkUsage]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin text-fordham-white" />
      </div>
    );
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleUpload() {
    setIsUploading(true);
  }

  function handleResumeOpen() {
    setIsResumeOpen(true);
  }

  return (
    <GradientContainer>
      <PageContainer marginBottom={true} marginTop={false}>
        <div className="w-full flex flex-col items-center gap-2 py-20 md:px-10">
          <h1 className="h4 md:h3 text-fordham-white">Profile</h1>
          <p className="body-txt-md px-0 md:px-20 text-center font-light text-fordham-light-gray/60">
            Manage your profile and settings here.
          </p>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
          {/* grid left */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm h-fit w-full">
              {/* Profile picture */}
              <div className="flex flex-col justify-center items-center rounded-full overflow-hidden w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
                <Image
                  src={user.profilePicture}
                  alt={user.firstName + " " + user.lastName}
                  width={160}
                  height={160}
                  className="object-cover rounded-full"
                  priority
                  quality={100}
                />
              </div>

              {/* Profile info */}
              <div className="flex flex-col justify-start items-start gap-6 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <h1 className="text-fordham-white text-2xl font-medium">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-fordham-white">Email: {user.email}</p>
                  <p className="text-fordham-white">Fordham University</p>
                </div>

                <div className="flex flex-row justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-2 min-w-[80px]">
                    <p className="text-fordham-light-gray">Year</p>
                    <p className="text-fordham-white">{user.gradYear}</p>
                  </div>

                  <div className="flex flex-col justify-start items-start gap-2">
                    <p className="text-fordham-light-gray">Major</p>
                    <p className="text-fordham-white">{user.major}</p>
                  </div>
                </div>
              </div>

              {/* Profile actions */}
              <div className="absolute top-4 right-4 flex flex-col items-center gap-4">
                <button
                  className="bg-fordham-white/5 rounded-[8px] p-4 hover:bg-fordham-white/10 hover:cursor-pointer"
                  onClick={handleEdit}
                >
                  <IconPencil className="w-6 h-6 hover:cursor-pointer hover:text-fordham-white text-fordham-light-gray" />
                </button>

                <button
                  className="bg-fordham-white/5 rounded-[8px] p-4 hover:bg-fordham-white/10 hover:cursor-pointer"
                  onClick={handleResumeOpen}
                >
                  <IconFile className="w-6 h-6 hover:cursor-pointer hover:text-fordham-white text-fordham-light-gray" />
                </button>

                <button className="md:hidden bg-fordham-white rounded-[8px] p-4" onClick={logout}>
                  <IconLogout className="w-6 h-6 text-fordham-black" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm w-full">
              <div className="flex flex-col justify-between items-start gap-6 w-full">
                <h2 className="text-fordham-white text-2xl font-medium">Looking For</h2>

                <div className="flex flex-row flex-wrap justify-center items-center md:justify-start md:items-start gap-4 w-full md:w-fit">
                  {user.interestedPositions?.map((position) => (
                    <Button
                      variant="tertiary"
                      text={position}
                      pressable={false}
                      className="w-full md:w-fit"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <Button icon={<IconLogout />} onClick={logout} text="Log out" variant="primary" />
            </div>
          </div>

          {/* grid right */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm">
              <div className="flex flex-col justify-between items-start gap-2 w-full">
                <div className="flex flex-row w-full justify-between items-center gap-2">
                  <h2 className="text-fordham-white text-2xl font-medium">Scans left</h2>
                  <div className="group relative">
                    <IconInfoCircle className="w-6 h-6 text-fordham-light-gray hover:cursor-pointer hover:text-fordham-white" />
                    <div className="p-6 absolute hidden group-hover:block bg-fordham-black/95 text-fordham-white text-sm rounded-[8px] right-0 top-10 w-[200px] z-10">
                      Each user has 20 scans per week
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-center items-center py-6 gap-6">
                  <UsageDonut current={usage?.remainingUses} total={20} />
                  <p className="text-fordham-white/80 text-sm">
                    Renews on {new Date(usage?.resetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm w-full">
              <div className="flex flex-col justify-between items-start gap-2 w-full">
                <h2 className="text-fordham-white text-2xl font-medium">Total Scans Used</h2>

                <div className="flex flex-col justify-center items-center gap-2 w-full">
                  <div className="flex flex-row items-center gap-2 py-6">
                    <IconTrophy className="w-8 h-8 text-fordham-white" />
                    <p className="text-fordham-white text-4xl font-medium">{usage?.totalScans}</p>
                  </div>
                  {/* <div className="flex flex-row items-center gap-2 py-6">
                    <IconTrophy className="w-8 h-8 text-fordham-white" />
                    <p className="text-fordham-white text-4xl font-medium">26</p>
                  </div> */}
                  {/* <p className="text-fordham-white/80 text-sm">You beat 99% of users</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      {isEditing && (
        <>
          <div className="fixed inset-0 bg-fordham-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <EditProfile user={user} onClose={() => setIsEditing(false)} />
          </div>
        </>
      )}

      {isResumeOpen && <ResumeModal active={isResumeOpen} setActive={setIsResumeOpen} />}
    </GradientContainer>
  );
}

function EditProfile({ user, onClose }) {
  return (
    <div className="bg-fordham-brown  rounded-[16px] p-8 w-full max-w-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-fordham-white/80 hover:text-fordham-white"
      >
        ✕
      </button>

      <h2 className="text-fordham-white text-2xl font-medium mb-6">Edit Profile</h2>

      <ProfileEditForm
        initialData={user}
        mode="edit"
        onSubmitSuccess={onClose}
        onCancel={onClose}
      />
    </div>
  );
}

const UsageDonut = ({ current, total }) => {
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = (current / total) * 100;
  const dashOffset = circumference - (fillPercentage / 100) * circumference;

  return (
    <div className="relative w-[182px] h-[182px] flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFFFFF" // fordham-white/5
          strokeWidth={strokeWidth}
          className="opacity-5"
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFFFFF" // fordham-white
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-row items-center justify-center text-fordham-white">
        <div className="text-4xl font-semibold pr-1">{current}</div>
        <div className="text-4xl font-semibold">/ {total}</div>
      </div>
    </div>
  );
};
