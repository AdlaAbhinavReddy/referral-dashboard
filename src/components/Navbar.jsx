import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" aria-label="Go to dashboard home" className="text-indigo-600 font-bold text-lg">
          Go Business
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3">
          <Link to="/" className="sr-only">
            Home
          </Link>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            Try for free
          </button>
          <button
            onClick={handleLogout}
            className="border border-red-300 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-50"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar