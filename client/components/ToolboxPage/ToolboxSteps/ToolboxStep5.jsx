export default function ToolboxStep5({ coverLetter, setCoverLetter, error, setError }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <textarea
        value={coverLetter}
        onChange={(e) => {
          setCoverLetter(e.target.value);
          if (setError) setError("");
        }}
        placeholder="Your cover letter will appear here..."
        className={`w-full flex-1 bg-fordham-brown text-fordham-white rounded-[8px] placeholder:text-fordham-gray/60 focus:outline-none resize-none
          ${error ? "border border-red-500" : ""}`}
      />
    </div>
  );
}
