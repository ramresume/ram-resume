import { useState } from "react";
import { IconX, IconAlertTriangle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function DeleteAccountModal({ active, setActive }) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user.email) return;
    
    setIsDeleting(true);
    await deleteAccount();
  };

  return (
    <div className="fixed inset-0 bg-fordham-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-fordham-brown rounded-[16px] p-6 w-full max-w-md h-fit relative">
        <button
          onClick={() => setActive(false)}
          className="absolute top-6 right-6 text-fordham-white/80 hover:text-fordham-white"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-red-500">
            <IconAlertTriangle className="w-8 h-8" />
            <h2 className="text-2xl font-medium">Delete Account</h2>
          </div>

          <div className="bg-fordham-white/10 rounded-[16px] p-6">
            <p className="text-fordham-white mb-4">
              This action cannot be undone. It will permanently delete your account and remove all your data from our servers, including:
            </p>
            <ul className="list-disc list-inside text-fordham-white/80 mb-4 ml-2">
              <li>Your profile information</li>
              <li>All uploaded resumes</li>
              <li>Scan history and results</li>
              <li>Usage data</li>
            </ul>
            <p className="text-fordham-white">
              To confirm, please type your full email address: <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full bg-fordham-white/10 text-fordham-white rounded-[8px] p-3 placeholder:text-fordham-gray/60 focus:outline-none border border-fordham-white/20 focus:border-fordham-white/40"
            />

            <div className="flex gap-4">
              <Button
                variant="tertiary"
                text="Cancel"
                onClick={() => setActive(false)}
                className="flex-1"
              />
              <Button
                variant="danger"
                text={isDeleting ? "Deleting..." : "Delete Account"}
                onClick={handleDeleteAccount}
                disabled={confirmEmail !== user?.email || isDeleting}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 