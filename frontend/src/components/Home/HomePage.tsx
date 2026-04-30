"use client";
import KnowledgeBase from "./KnowledgeBaseSection/KnowledgeBase";
import AIChat from "./AIChatSection/AIChat";
import Header from "./Header";
import { AuthData } from "@/src/types/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/src/state/slices/authSlice";
import {
  clearKnowledge,
  updateKnowledge,
} from "@/src/state/slices/knowledgeSlice";
import { clearMessages } from "@/src/state/slices/conversationSlice";
import GlobalLoader from "@/src/ui/GlobalLoader";
import { RootState } from "@/src/state/store";
import { fetchDocsNames } from "@/src/utils/apiFunctions/docsAPI";
import { signOutUser } from "@/src/utils/apiFunctions/authAPI";
import ErrorToast from "@/src/ui/ErrorToast";
import { useRouter } from "next/navigation";
import { clearGlobalError, setGlobalError } from "@/src/state/slices/globalErrorsSlice";
import SectionToggle from "./SectionToggle";

const HomePage = ({ authData }: { authData: AuthData }) => {
  const dispatch = useDispatch();
  const { knowledgeBase, globalError}  = useSelector((s: RootState) => ({
    knowledgeBase: s.knowledge.knowledge,
    globalError: s.globalError
  }));
  const [activeSection, toggleActiveSection] = useState<"kb"|"ai">("ai");

  const loading = knowledgeBase === null;
  const router = useRouter();


  useEffect(() => {
    const currentPath = typeof window !== "undefined" ? location.pathname + location.search : "/";

    const fetchUploadedDocs = async () => {
      const knowledge = [];
      const data = await fetchDocsNames();
      dispatch(clearGlobalError());
      if (data.error) {
        const error = data.error;
        if(typeof window !== "undefined"){
          dispatch(setGlobalError(error.errors[0]));
        }

        if (error.type === "auth_error") {
          const res = await signOutUser();
          if (res?.type !== "error") {
            router.replace(`/auth/signin?error=auth_error&redirect=${encodeURIComponent(currentPath)}`);
          } else {
            if(typeof window !== "undefined"){
              dispatch(setGlobalError(error.errors[0]));
            }
          }
        }
      } else {
        knowledge.push(...data.data.docs);
      }

      dispatch(updateKnowledge(knowledge));
    };

    const username = authData.user?.username || "";
    dispatch(setAuth({ username }));
    fetchUploadedDocs();
    return () => {
      dispatch(clearKnowledge());
      dispatch(clearMessages());
    };
  }, []);

  useEffect(() => {
    if (!knowledgeBase || knowledgeBase.length === 0) {
      return;
    }
  }, [knowledgeBase]);

  return (
    <>
      {globalError.message && <ErrorToast {...globalError} />}
      {loading && (
        <GlobalLoader text={"Initializing your personalised bot..."} />
      )}
      <Header />
      <main className="main relative h-dvh box-border pt-16 flex flex-col md:flex-row overflow-hidden">
        <div className="pointer-events-none absolute inset-0 top-16 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(168,85,247,0.06),transparent)]" aria-hidden />
        <div className="relative hidden md:flex w-full h-full min-h-0 gap-0 overflow-hidden md:border-t md:border-white/5">
          <KnowledgeBase/>
          <div className="hidden md:block w-px shrink-0 bg-gradient-to-b from-transparent via-white/10 to-transparent self-stretch" aria-hidden />
          <AIChat />
        </div>

        <div className="relative flex flex-col md:hidden w-full h-full min-h-0 pb-16">
          {activeSection === "ai" ? <AIChat/> : <KnowledgeBase/>}
          <SectionToggle activeSection={activeSection} toggleActiveSection = { toggleActiveSection}/>
        </div>
        
      </main>
    </>
  );
};

export default HomePage;
