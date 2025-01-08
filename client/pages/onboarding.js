import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useApi } from "../hooks/useApi";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import { IconChevronDown } from "@tabler/icons-react";

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

const currentYear = new Date().getFullYear();
const gradYears = Array.from({ length: 6 }, (_, i) => currentYear + i);

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gradYear: "",
    major: "",
    interestedPositions: [],
    onboardingCompleted: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useApi();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/user");
        if (response.onboardingCompleted) {
          router.push("/profile");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          router.push("/");
        }
      }
    };
    checkUser();
  }, [router]);

  const handleInputChange = (e) => {
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
    setError("");
    setLoading(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.gradYear ||
      !formData.major ||
      formData.interestedPositions.length === 0
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await api.request("/api/user", {
        method: "PUT",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gradYear: formData.gradYear,
          major: formData.major,
          interestedPositions: formData.interestedPositions,
          onboardingCompleted: true,
        }),
      });

      console.log("Update response:", response);
      router.push("/profile");
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SelectWrapper = ({ children, label, id }) => (
    <div className="relative">
      {children}
      <IconChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-fordham-light-gray/60 pointer-events-none" />
    </div>
  );

  return (
    <PageContainer marginBottom={true}>
      <GradientContainer>
        <div className="w-full flex flex-col items-center gap-6 py-24 px-6 md:px-10">
          <div className="max-w-3xl text-center">
            <h1 className="h4 md:h2 text-fordham-white mb-4">Complete Your Profile</h1>
            <p className="body-txt-md md:body-txt-lg text-center font-light text-fordham-light-gray/60 max-w-2xl mx-auto">
              Help us personalize your experience and match you with the right opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-8">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded-[16px] mb-8">
                {error}
              </div>
            )}

            <div className="space-y-8 bg-fordham-white/5 p-8 rounded-[24px]">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-md font-medium text-fordham-white mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-[16px] bg-fordham-black text-fordham-white 
                      placeholder:text-fordham-light-gray/60 focus:outline-none focus:ring-2 
                      focus:ring-fordham-brown/50 border border-fordham-light-gray/10"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-md font-medium text-fordham-white mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-[16px] bg-fordham-black text-fordham-white 
                      placeholder:text-fordham-light-gray/60 focus:outline-none focus:ring-2 
                      focus:ring-fordham-brown/50 border border-fordham-light-gray/10"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label
                  htmlFor="gradYear"
                  className="block text-md font-medium text-fordham-white mb-2"
                >
                  Expected Graduation Year
                </label>
                <SelectWrapper id="gradYear">
                  <select
                    id="gradYear"
                    name="gradYear"
                    required
                    value={formData.gradYear}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-[16px] bg-fordham-black text-fordham-white 
                      appearance-none focus:outline-none focus:ring-2 focus:ring-fordham-brown/50
                      border border-fordham-light-gray/10"
                  >
                    <option value="">Select year</option>
                    {gradYears.map((year) => (
                      <option key={year} value={year} className="bg-fordham-black">
                        {year}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </div>

              {/* Major Selection */}
              <div>
                <label
                  htmlFor="major"
                  className="block text-md font-medium text-fordham-white mb-2"
                >
                  Major
                </label>
                <SelectWrapper id="major">
                  <select
                    id="major"
                    name="major"
                    required
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-[16px] bg-fordham-black text-fordham-white 
                      appearance-none focus:outline-none focus:ring-2 focus:ring-fordham-brown/50
                      border border-fordham-light-gray/10"
                  >
                    <option value="">Select major</option>
                    {majors.map((major) => (
                      <option key={major} value={major} className="bg-fordham-black">
                        {major}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </div>

              {/* Interested Positions */}
              <div>
                <label className="block text-md font-medium text-fordham-white mb-4">
                  Interested Positions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {positions.map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => handlePositionToggle(position)}
                      className={`px-4 py-3 rounded-full text-sm transition-all transform
                        ${
                          formData.interestedPositions.includes(position)
                            ? "bg-gradient-to-r from-[#7E1515] via-[#BE2929] to-[#F34848] text-fordham-white"
                            : "bg-fordham-black text-fordham-light-gray/60 hover:bg-fordham-black/80 hover:text-fordham-white"
                        }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 mt-8 rounded-full bg-gradient-to-r from-[#7E1515] via-[#BE2929] to-[#F34848] 
                hover:from-[#6E1313] hover:via-[#AE2727] hover:to-[#E34646]
                text-fordham-white font-medium transition-colors
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </GradientContainer>
    </PageContainer>
  );
}
