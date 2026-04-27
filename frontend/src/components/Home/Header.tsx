"use client";
import { setGlobalError } from '@/src/state/slices/globalErrorsSlice';
import { RootState } from '@/src/state/store';
import { signOutUser } from '@/src/utils/apiFunctions/authAPI';
import { useRouter } from 'next/navigation';
import { LuLogOut } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const Header = () => {
  const username = useSelector((state:RootState) => state.auth.username);
  const router = useRouter();

  const logoutHandler = async() => {
    const res = await signOutUser();
    if(res?.type !== "error"){
        router.replace("/auth/signin");
    }else{
        setGlobalError(res?.errors);
    }

  }

  return (
    <header className="header h-16 fixed w-full bg-black shadow-[0px_0px_10px] shadow-[#000000] z-1000">
        <nav className="nav h-full flex w-full justify-between items-center px-4 text-purple-300 font-bold">
            <div className="brand">
                <h1 className="logo text-xl md:text-2xl">MY KNOWLEDGEBASE</h1>
            </div>

            <div className="actions flex items-center justify-center gap-2">
                <span className="bg-gray-800 rounded-sm flex text-xs items-center justify-center text-gray-400 p-1">{username}</span>
                <button className="logout cursor-pointer" onClick={logoutHandler}>
                    <LuLogOut size={20}/>
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header