import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-slate-600 mb-4">Page not found</p>
        <Link to="/" className="text-indigo-500 font-semibold hover:text-indigo-600">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound