import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { IconLoader2 } from "@tabler/icons-react";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Head from "next/head";

export default function Terms() {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading, acceptTerms, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSubmitting && (!user || user.hasAcceptedTerms)) {
      router.replace("/");
    }
  }, [user, loading, router, isSubmitting]);

  const handleAccept = async () => {
    if (!accepted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await acceptTerms();
      router.push("/onboarding");
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to accept terms. Please try again.");
    }
  };

  const handleDecline = async () => {
    try {
      setIsSubmitting(true);
      await logout();
      toast.error("You must accept the terms to use RAMresume.");
      router.replace("/");
    } catch (error) {
      setIsSubmitting(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin text-fordham-white" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Terms | RAMResume</title>
        <meta
          name="description"
          content="Please read and understand our terms of service before proceeding"
        />
        <meta property="og:title" content="Terms | RAMResume" />
        <meta
          property="og:description"
          content="Please read and understand our terms of service before proceeding"
        />
        <meta property="og:type" content="website" />
      </Head>
      <PageContainer marginBottom={true}>
        <GradientContainer>
          <div className="w-full flex flex-col items-center gap-6 py-20 md:px-10">
            <div className="max-w-3xl text-center">
              <h1 className="h2 text-fordham-white mb-4">
                Notice About RAM Resume AI Usage
              </h1>
              <p className="body-txt-md text-center font-light text-fordham-light-gray/60 max-w-2xl mx-auto">
                Please read and understand our terms of service before proceeding
              </p>
            </div>

            <div className="w-full max-w-2xl mt-6">
              <div className="space-y-6 bg-fordham-white/5 p-6 rounded-[16px]">
                <div className="space-y-6">
                  <p className="text-fordham-light-gray/80">
                    Please read and acknowledge the following:
                  </p>
                  <ol className="list-decimal list-inside space-y-4 text-fordham-light-gray/60">
                    <li>
                      RAMresume uses artificial intelligence to assist with resume optimization.
                    </li>
                    <li>
                      AI technology can sometimes generate incorrect or incomplete information.
                    </li>
                    <li>All AI-generated suggestions should be carefully reviewed and verified.</li>
                    <li>You are responsible for ensuring the accuracy of your final resume.</li>
                    <li>Always use professional judgment when applying AI suggestions.</li>
                  </ol>
                </div>

                <div className="bg-fordham-brown p-4 rounded-[8px] flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mr-3 h-4 w-4 cursor-pointer accent-[#BE2929]"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="terms" className="text-fordham-white cursor-pointer">
                    I understand and accept these terms
                  </label>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleDecline}
                    disabled={isSubmitting}
                    text="Decline"
                    variant="secondary"
                  />
                  <Button
                    onClick={handleAccept}
                    disabled={!accepted || isSubmitting}
                    text={isSubmitting ? "Accepting..." : "Accept"}
                    variant="primary"
                    icon={isSubmitting ? <IconLoader2 className="w-4 h-4 animate-spin" /> : null}
                    iconPosition="before"
                  />
                </div>
              </div>
            </div>
          </div>
        </GradientContainer>
      </PageContainer>
    </>
  );
}
