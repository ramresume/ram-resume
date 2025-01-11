import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import Button from "@/components/ui/Button";
import { IconChevronDown } from "@tabler/icons-react";
import toast from "react-hot-toast";

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
const gradYears = Array.from({ length: 8 }, (_, i) => currentYear - 4 + i);

const CustomSelect = ({ options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative gap-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex-1 bg-fordham-white/10 text-fordham-white rounded-[8px] 
          px-5 py-3 flex justify-between items-center focus:outline-none"
      >
        <span className={!value ? "text-fordham-gray/60" : ""}>{value || placeholder}</span>
        <IconChevronDown
          className={`text-fordham-gray/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-fordham-black rounded-[8px] shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: option } });
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 text-left hover:bg-fordham-white/5
                ${
                  value === option
                    ? "bg-fordham-white/10 text-fordham-white"
                    : "text-fordham-gray/60 hover:text-fordham-white"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UserProfileForm({
  initialData = {},
  onSubmitSuccess,
  onCancel,
  onLogout,
  mode = "edit",
}) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    gradYear: initialData.gradYear || "",
    major: initialData.major || "",
    interestedPositions: initialData.interestedPositions || [],
    onboardingCompleted: mode === "onboarding" ? false : undefined,
  });

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
      await api.request("/api/user", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      setLoading(false);
      toast.success(
        mode === "onboarding" ? "Profile setup completed!" : "Profile updated successfully"
      );

      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess();
        }, 100);
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Update error:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded-[16px] mb-8">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-[16px]">
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
              placeholder="Enter first name"
              className="w-full flex-1 bg-fordham-white/10 text-fordham-white rounded-[8px] 
                placeholder:text-fordham-gray/60 focus:outline-none px-5 py-3 
                border-transparent focus:ring-0"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-md font-medium text-fordham-white mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              className="w-full flex-1 bg-fordham-white/10 text-fordham-white rounded-[8px] 
                placeholder:text-fordham-gray/60 focus:outline-none px-5 py-3 
                border-transparent focus:ring-0"
            />
          </div>
        </div>

        {/* Graduation Year and Major */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <label
              htmlFor="gradYear"
              className="block text-md font-medium text-fordham-white mb-2 w-full"
            >
              Expected Graduation Year
            </label>
            <CustomSelect
              options={gradYears}
              value={formData.gradYear}
              onChange={handleInputChange}
              placeholder="Select year"
              name="gradYear"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="major"
              className="block text-md font-medium text-fordham-white mb-2 w-full"
            >
              Major
            </label>
            <CustomSelect
              options={majors}
              value={formData.major}
              onChange={handleInputChange}
              placeholder="Select major"
              name="major"
            />
          </div>
        </div>

        {/* Interested Positions */}
        <div>
          <label className="block text-md font-medium text-fordham-white mb-4">
            Interested Positions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            {positions.map((position) => (
              <button
                key={position}
                type="button"
                onClick={() => handlePositionToggle(position)}
                className={`px-5 py-3 rounded-[8px] transition-[background,transform,outline] 
                  duration-50 ease-in-out flex items-center justify-center
                  ${
                    formData.interestedPositions.includes(position)
                      ? "bg-fordham-white/10 text-fordham-white hover:text-fordham-light-gray"
                      : "bg-fordham-black/50 text-fordham-gray/60 hover:text-fordham-white hover:bg-fordham-white/5"
                  }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            text="Cancel"
            variant="secondary"
            className="flex-1"
          />
        )}
        {onLogout && (
          <Button
            type="button"
            onClick={onLogout}
            text="Logout"
            variant="secondary"
            className="flex-1"
          />
        )}
        <Button
          type="submit"
          text={loading ? "Saving..." : mode === "onboarding" ? "Continue" : "Save"}
          variant="primary"
          disabled={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
}
