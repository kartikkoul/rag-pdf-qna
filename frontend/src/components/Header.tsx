import { BiLogOut } from 'react-icons/bi';
import { IoMdLogOut } from 'react-icons/io';
import { LuLogOut } from 'react-icons/lu';

const Header = () => {
  const user = {
    username: "levelsio"
  }

  return (
    <header className="header bg-black flex items-center justify-center h-16 shadow-[0px_0px_10px] shadow-[#000000]">
        <nav className="nav flex w-full justify-between items-center px-4 text-purple-300 font-bold">
            <div className="brand">
                <h1 className="logo text-2xl">MY KNOWLEDGEBASE</h1>
            </div>

            <div className="actions flex items-center gap-2">
                <span className="bg-gray-800 rounded-sm flex text-xs items-center justify-center text-gray-400 p-1">{user.username}</span>
                <button className="logout cursor-pointer">
                    <LuLogOut/>
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header