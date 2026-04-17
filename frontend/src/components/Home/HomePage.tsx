"use client";
import KnowledgeBase from './KnowledgeBaseSection/KnowledgeBase'
import AIChat from './AIChatSection/AIChat'
import Header from './Header'
import { AuthData } from '@/src/types/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/src/state/slices/authSlice';
import { clearKnowledge, fetchKnowledge } from '@/src/state/slices/knowledgeSlice';

const HomePage = ({authData} : {authData: AuthData}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const username = authData.user?.username || "";
        dispatch(setAuth({username}));
        dispatch(fetchKnowledge());

        return () => {
            dispatch(clearKnowledge());
        }
    }, [dispatch, authData])

    return (
        <>
            <Header />
            <main className="main flex flex-col max-h-screen">
                <div className="flex mt-16 gap-8 px-4 h-screen">
                    <KnowledgeBase />
                    <AIChat />
                </div>
            </main>
        </>
    )
}

export default HomePage