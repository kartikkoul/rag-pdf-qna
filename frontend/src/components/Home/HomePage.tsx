import { useDispatch } from 'react-redux'
import KnowledgeBase from './KnowledgeBaseSection/KnowledgeBase'
import AIChat from './AIChatSection/AIChat'
import Header from './Header'
import { useEffect } from 'react'
import { setAuth } from '@/src/state/slices/authSlice'

const HomePage = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setAuth({
            authToken: "blahblah",
            username: "levelsio"
        }))
    })

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