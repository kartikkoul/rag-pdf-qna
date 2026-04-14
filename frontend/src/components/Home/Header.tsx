import { RootState } from '@/src/state/store';
import { LuLogOut } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const Header = () => {
  const username = useSelector((state:RootState) => state.auth.username)
  console.log(username);
  return (
    <header className="header fixed w-full">
        <nav className="nav  bg-black h-16 shadow-[0px_0px_10px] shadow-[#000000]  flex w-full justify-between items-center px-4 text-purple-300 font-bold">
            <div className="brand">
                <h1 className="logo text-2xl">MY KNOWLEDGEBASE</h1>
            </div>

            <div className="actions flex items-center gap-2">
                <span className="bg-gray-800 rounded-sm flex text-xs items-center justify-center text-gray-400 p-1">{username}</span>
                <button className="logout cursor-pointer">
                    <LuLogOut/>
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header