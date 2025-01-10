import { Html, Head, Main, NextScript } from "next/document";

export const metadata = {
  title: "RAMResume | Your Professional Resume Builder",
  description:
    "Create professional resumes with RAMResume, the official resume builder for Fordham University students. Get templates, tips, and expert guidance.",
  openGraph: {
    title: "RAMResume | Your Professional Resume Builder",
    description:
      "Create professional resumes with RAMResume, the official resume builder for Fordham University students.",
    type: "website",
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
