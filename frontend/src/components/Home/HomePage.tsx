"use client"
import KnowledgeBase from './KnowledgeBaseSection/KnowledgeBase'
import AIChat from './AIChatSection/AIChat'
import Header from './Header'
import { AuthData } from '@/src/types/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '@/src/state/slices/authSlice'
import { clearKnowledge, updateKnowledge } from '@/src/state/slices/knowledgeSlice'
import { clearMessages } from '@/src/state/slices/conversationSlice'
import GlobalLoader from '@/src/ui/GlobalLoader'
import { RootState } from '@/src/state/store';
import { fetchDocsNames } from '@/src/utils/apiFunctions/docsAPI';
import { signOutUser } from '@/src/utils/apiFunctions/authAPI';
import { redirect } from 'next/navigation';

const HomePage = ({ authData }: { authData: AuthData }) => {
    const dispatch = useDispatch();
    const knowledgeBase = useSelector((s: RootState) => s.knowledge.knowledge);
    const loading = knowledgeBase === null;

    
    useEffect(() => {
        const fetchUploadedDocs = async() => {
            const knowledge = [];
            const data = await fetchDocsNames();
            if(data.error){
                const error = data.error;
                if(error.type === "auth_error"){
                    const res = await signOutUser();
                    if(res?.type !== "error"){
                        redirect("/auth/signin");
                    }else{
                        alert(res?.error);
                    }
                };
            }else{
                knowledge.push(...data.data.docs);
            }

            dispatch(updateKnowledge(knowledge));
        }
    

        const username = authData.user?.username || ""
        dispatch(setAuth({ username }))
        fetchUploadedDocs();
        return () => {
            dispatch(clearKnowledge())
            dispatch(clearMessages())
        }
    }, [dispatch, authData])

    useEffect(() => {
        if(!knowledgeBase || knowledgeBase.length === 0){
            return;
        };
    }, [knowledgeBase])


    return (
        <>
            {
                loading && <GlobalLoader text={"Initializing your personalised bot..."} />
            }
            <Header />
            <main className="main flex flex-col max-h-screen">
                <div className="flex mt-16 gap-8 pl-4 h-screen">
                    <KnowledgeBase />
                    <AIChat />
                </div>
            </main>
        </>
    )
}

export default HomePage