"use client";
import { setGlobalError } from '@/src/state/slices/globalErrorsSlice';
import { AppDispatch, RootState } from '@/src/state/store';
import { signOutUser } from '@/src/utils/apiFunctions/authAPI';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { LuLogOut } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const username = useSelector((state:RootState) => state.auth.username);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const logoutHandler = async() => {
    const res = await signOutUser();
    if(res?.type !== "error"){
        router.replace("/auth/signin");
    }else{
        dispatch(setGlobalError(res?.errors?.[0] ?? "Failed to sign out."));
    }

  }

  return (
    <header className="header h-16 fixed top-0 w-full z-1000 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.85)]">
        <nav className="nav h-full mx-auto max-w-[1600px] flex w-full justify-between items-center px-4 md:px-6">
            <div className="brand flex min-w-0 items-center gap-2.5 md:gap-3">
                <Image
                  src="/icon.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-8 w-8 shrink-0 rounded-lg md:h-9 md:w-9"
                  unoptimized
                  priority
                />
                <h1 className="logo truncate text-lg md:text-xl font-bold tracking-tight bg-linear-to-r from-purple-200 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                  My KnowledgeBase
                </h1>
            </div>

            <div className="actions flex items-center justify-center gap-2 md:gap-3">
                <span className="max-w-40 truncate rounded-md border border-white/10 bg-neutral-900/80 px-2.5 py-1 text-xs font-medium text-neutral-300">
                  {username}
                </span>
                <button type="button" className="cursor-pointer logout rounded-lg p-2 text-neutral-400 transition hover:bg-white/10 hover:text-neutral-100" title="Sign out" aria-label="Sign out" onClick={logoutHandler}>
                    <LuLogOut size={20}/>
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header