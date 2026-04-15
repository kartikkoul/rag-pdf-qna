import FeatureItem from "@/src/components/AuthPage/FeatureItem";
import { BiBrain } from "react-icons/bi";
import { TbFileDescriptionFilled } from "react-icons/tb";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <main className="min-h-screen max-h-screen flex flex-row items-center gap-10 px-15">
          <div className="info w-3/5 flex flex-col">
               <div className="headline">
                <h1 className="text-8xl font-semibold">Welcome to <i className="text-purple-300">My</i> KnowledgeBase</h1>
                <p className=" text-neutral-400 text-2xl w-150 mt-4">Build your knowledge base by uploading pdfs and then ask questions whenever you want.</p>
               </div>
               <div className="features bg-bg-neutral p-4 rounded-lg mt-8 w-200">
                  <ul className="flex flex-col gap-2">
                    {features.map((feature, index) => (<FeatureItem key={index} {...feature} />))}
                  </ul>
               </div>
          </div>
          {children}
        </main>
  )
}
