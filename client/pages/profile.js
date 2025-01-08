import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import { IconInfoCircle, IconLoader2, IconPencil, IconTrophy } from "@tabler/icons-react";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, loading, logout, usage, checkUsage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  console.log(user);

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

  useEffect(() => {
    checkUsage();
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

  return (
    <GradientContainer>
      <PageContainer marginBottom={true} marginTop={false}>
        <div className="w-full flex flex-col items-center gap-2 py-20 px-10">
          <h1 className="h4 md:h3 text-fordham-white">Profile</h1>
          <p className="body-txt-md px-0 md:px-20 text-center font-light text-fordham-light-gray/60">
            Manage your profile and settings here.
          </p>
        </div>
        <div className={`grid grid-cols-3 gap-6`}>
          {/* grid left */}
          <div className="flex flex-col gap-6 col-span-2">
            <div className="flex flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm h-fit">
              {/* Profile picture */}
              <div className="flex flex-col justify-center items-center rounded-full overflow-hidden w-[160px] h-[160px]">
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
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="flex flex-col justify-start items-start gap-2">
                  <h1 className="text-fordham-white text-2xl font-medium">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-fordham-white">{user.email}</p>
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
              <div className="absolute top-4 right-4">
                <button
                  className="bg-fordham-white/5 rounded-[8px] p-4 hover:bg-fordham-white/10 hover:cursor-pointer"
                  onClick={handleEdit}
                >
                  <IconPencil className="w-6 h-6 hover:cursor-pointer hover:text-fordham-white text-fordham-light-gray" />
                </button>
              </div>
            </div>

            <div className="flex flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm w-full">
              <div className="flex flex-col justify-between items-start gap-6 w-full">
                <h2 className="text-fordham-white text-2xl font-medium">Looking For</h2>

                <div className="flex flex-row flex-wrap gap-6">
                  {user.interestedPositions?.map((position) => (
                    <Button variant="tertiary" text={position} pressable={false} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Button onClick={logout} text="Log out" variant="primary" />
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
                <div className="flex w-full justify-center items-center py-6">
                  <UsageDonut current={usage?.remainingUses} total={20} />
                </div>
                <p className="text-fordham-white/80 text-sm">
                  Renews on {new Date(usage?.resetDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6 bg-fordham-brown p-6 rounded-[16px] backdrop-blur-sm w-full">
              <div className="flex flex-col justify-between items-start gap-2 w-full">
                <h2 className="text-fordham-white text-2xl font-medium">Total Scans Used</h2>

                <div className="flex flex-col justify-center items-center gap-2 w-full">
                   <div className="flex flex-row items-center gap-2 py-6">
                    <IconTrophy className="w-8 h-8 text-fordham-white" />
                    <p className="text-fordham-white text-4xl font-medium">26</p>
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
          <div className="fixed h-screen inset-0 bg-fordham-black/80 backdrop-blur-sm z-[60]" />
          <div className="fixed h-screen inset-0 flex items-center justify-center z-[70] overflow-y-auto">
            <EditProfile user={user} onClose={() => setIsEditing(false)} />
          </div>
        </>
      )}
    </GradientContainer>
  );
}

const majors = [
  "Computer Science",
  "Information Systems",
  "Business Administration",
  "Finance",
  "Marketing",
  "Economics",
  "Mathematics",
  "Other",
];

const positions = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "Financial Analyst",
  "Marketing Specialist",
  "Data Analyst",
  "Other",
];

function EditProfile({ user, onClose }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    gradYear: user.gradYear || "",
    major: user.major || "",
    interestedPositions: user.interestedPositions || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositionToggle = (position) => {
    setFormData((prev) => {
      const positions = prev.interestedPositions.includes(position)
        ? prev.interestedPositions.filter((p) => p !== position)
        : [...prev.interestedPositions, position];
      return { ...prev, interestedPositions: positions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.request("/api/user", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      toast.success("Profile updated successfully");
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="bg-fordham-white rounded-[16px] p-8 w-full max-w-2xl mx-4 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-fordham-black/80 hover:text-fordham-black"
      >
        ✕
      </button>

      <h2 className="text-fordham-black text-2xl font-medium mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-fordham-black/80 text-sm block mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-fordham-brown/5 rounded-[8px] p-2 text-fordham-black border border-fordham-white/20 focus:border-fordham-white/40 outline-none"
            />
          </div>
          <div>
            <label className="text-fordham-black/80 text-sm block mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-fordham-brown/5 rounded-[8px] p-2 text-fordham-black border border-fordham-white/20 focus:border-fordham-white/40 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-fordham-black/80 text-sm block mb-2">
            Expected Graduation Year
          </label>
          <select
            name="gradYear"
            value={formData.gradYear}
            onChange={handleChange}
            className="w-full bg-fordham-brown/5 rounded-[8px] p-2 text-fordham-black border border-fordham-white/20 focus:border-fordham-white/40 outline-none"
          >
            <option value="">Select Year</option>
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-fordham-black/80 text-sm block mb-2">Major</label>
          <select
            name="major"
            value={formData.major}
            onChange={handleChange}
            className="w-full bg-fordham-brown/5 rounded-[8px] p-2 text-fordham-black border border-fordham-white/20 focus:border-fordham-white/40 outline-none"
          >
            <option value="">Select Major</option>
            {majors?.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-fordham-black/80 text-sm block mb-2">Interested Positions</label>
          <div className="grid grid-cols-2 gap-2">
            {positions?.map((position) => (
              <button
                key={position}
                type="button"
                onClick={() => handlePositionToggle(position)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  formData.interestedPositions.includes(position)
                    ? "bg-gradient-to-r from-[#7E1515] via-[#BE2929] to-[#F34848] text-white"
                    : "bg-fordham-brown/5 text-fordham-black hover:bg-fordham-brown/10"
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-4 z-10">
          <Button
            type="button"
            onClick={onClose}
            text="Cancel"
            variant="border"
            className="flex-1 text-fordham-black border-fordham-black"
          />
          <Button
            type="submit"
            text={loading ? "Saving..." : "Save Changes"}
            variant="tertiary"
            className="flex-1"
            disabled={loading}
          />
        </div>
      </form>
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
