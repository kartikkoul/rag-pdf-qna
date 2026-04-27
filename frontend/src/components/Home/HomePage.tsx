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
      <main className="main flex flex-col h-full overflow-y-auto scrollbar-custom">
        <div className="hidden md:flex w-full h-full mt-16 gap-8">
          <KnowledgeBase/>
          <AIChat />
        </div>

        <div className="flex flex-col md:hidden mt-16 gap-8 h-full">
          {activeSection === "ai" ? <AIChat/> : <KnowledgeBase/>}
          <SectionToggle activeSection={activeSection} toggleActiveSection = { toggleActiveSection}/>
        </div>
        
      </main>
    </>
  );
};

export default HomePage;
