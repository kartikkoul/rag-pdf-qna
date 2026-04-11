import { IoMdLogOut } from 'react-icons/io';

const Header = () => {
  const user = {
    username: "levelsio"
  }

  return (
    <header className="header bg-black flex items-center justify-center h-12">
        <nav className="nav flex w-full justify-between items-center px-4 text-purple-300">
            <div className="brand">
                <h1 className="logo text-shadow-sm text-shadow-purple-900 text-lg">MY KNOWLEDGEBASE</h1>
            </div>

            <div className="actions flex items-center gap-2">
                <span className="bg-gray-800 rounded-xs flex items-center justify-center h-6 w-18 text-gray-500">{user.username}</span>
                <button className="logout">
                    <IoMdLogOut />
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header