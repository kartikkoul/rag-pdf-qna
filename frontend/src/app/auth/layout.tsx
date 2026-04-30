import FeatureItem from "@/src/components/AuthPage/FeatureItem";
import { AuthData } from "@/src/types/types";
import { getUser } from "@/src/utils/auth";
import { redirect } from "next/navigation";
import { BiBrain } from "react-icons/bi";
import { BsLightningCharge } from "react-icons/bs";
import { TbFileDescriptionFilled } from "react-icons/tb";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData: AuthData = (await getUser()) as AuthData;

  if (authData) {
    redirect("/");
  }

  const features = [
    {
      icon: <TbFileDescriptionFilled className="size-6" />,
      featureTitle: "VECTORIZED PROCESSING",
      featureDescription: "Vectorization of documents for efficient retrieval",
    },
    {
      icon: <BiBrain className="size-6" />,
      featureTitle: "AI SYNTHESIS",
      featureDescription: "Context-aware question answering",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-start overflow-y-auto overflow-x-hidden scrollbar-custom px-4 py-8 md:items-center md:px-10 xl:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(45,212,191,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 md:flex-row md:justify-between md:gap-10">
        <div className="info w-full md:w-3/5 lg:w-7/12 flex flex-col items-center md:items-start">
          <div className="headline w-full max-w-3xl text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]">
              Welcome to <i className="text-purple-300">My</i> KnowledgeBase
            </h1>
            <p className="text-neutral-300 text-base md:text-lg mt-5 max-w-2xl w-9/10">
              Build your knowledge base by uploading PDFs, then ask questions
              and get accurate answers from your own documents.
            </p>
          </div>
          <div className="sfeatures hidden md:block w-9/10 max-w-3xl bg-neutral-900/80 border border-white/10 p-5 rounded-xl mt-10 backdrop-blur-sm shadow-[0px_0px_50px_-24px_rgba(168,85,247,0.75)]">
            <ul className="flex flex-col gap-1">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </ul>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
