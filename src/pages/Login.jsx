import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const LOGIN_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (Cookies.get('jwt_token')) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const responseJson = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', responseJson.data.token)
        navigate('/')
      } else {
        setError(responseJson.message)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Go Business</h1>
        <p className="text-slate-500 mb-8">Sign in to open your referral dashboard.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block font-semibold text-slate-900 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-semibold text-slate-900 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login