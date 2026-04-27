import FeatureItem from "@/src/components/AuthPage/FeatureItem";
import { AuthData } from "@/src/types/types";
import { getUser } from "@/src/utils/auth";
import { redirect } from "next/navigation";
import { BiBrain } from "react-icons/bi";
import { TbFileDescriptionFilled } from "react-icons/tb";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const authData : AuthData = await getUser() as AuthData;

  if(authData){
    redirect("/");
  }

  const features = [
    {
      icon: <TbFileDescriptionFilled className="size-6"/>,
      featureTitle: "VECTORIZED PROCESSING",
      featureDescription: "Vectorization of documents for efficient retrieval"
    },
    {
      icon: <BiBrain className="size-6"/>,
      featureTitle: "AI SYNTHESIS",
      featureDescription: "Context-aware question answering"
    }
  ]

  return (
        <main className="min-h-screen max-h-screen flex flex-col md:flex-row items-center justify-center md:justify-normal gap-10 md:px-15">
          <div className="info md:w-3/5 flex flex-col items-center md:items-start">
               <div className="headline text-center md:text-left flex flex-col items-center">
                <h1 className="text-2xl sm:text-5xl xl:text-xl w-9/10  2xl:text-8xl font-semibold">Welcome to <i className="text-purple-300">My</i> KnowledgeBase</h1>
                <p className="text-neutral-400 xl:text-xl w-9/10 mt-4">Build your knowledge base by uploading pdfs and then ask questions whenever you want.</p>
               </div>
               <div className="features hidden md:block bg-bg-neutral p-4 rounded-lg mt-8 xl:w-150 2xl:w-200">
                  <ul className="flex flex-col gap-2">
                    {features.map((feature, index) => (<FeatureItem key={index} {...feature} />))}
                  </ul>
               </div>
          </div>
          {children}
        </main>
  )
}
