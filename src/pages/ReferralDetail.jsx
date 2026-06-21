import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const REFERRALS_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

const formatDate = (isoDate) => (isoDate ? isoDate.replace(/-/g, '/') : '')

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
const formatProfit = (amount) => currencyFormatter.format(amount)

function ReferralDetail() {
  const { id } = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const token = Cookies.get('jwt_token')
        const response = await fetch(`${REFERRALS_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const responseJson = await response.json()

        if (!response.ok) {
          if (isMounted) setNotFound(true)
          return
        }

        const payload = responseJson.data
        let row = null

        // Shape 1: data IS the row itself
        if (payload?.id !== undefined && payload?.name !== undefined) {
          row = payload
        }
        // Shape 2: data.referrals contains the row
        else if (Array.isArray(payload?.referrals)) {
          row = payload.referrals.find((r) => String(r.id) === String(id))
        }

        if (row && isMounted) {
          setReferral(row)
        } else if (isMounted) {
          setNotFound(true)
        }
      } catch (err) {
        if (isMounted) setNotFound(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto px-6 py-8 flex-1">
        <Link to="/" className="text-indigo-500 font-semibold text-sm">
          ← Back to dashboard
        </Link>

        {loading ? (
          <p className="text-slate-500 mt-6">Loading...</p>
        ) : notFound || !referral ? (
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Referral not found</h1>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-1">Referral Details</h1>
            <p className="text-slate-500 mb-6">Full information for this referral partner.</p>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{referral.name}</h2>
                <span className="bg-indigo-50 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
                  {referral.serviceName}
                </span>
              </div>

              <dl>
                <div className="flex justify-between py-3 border-b border-slate-50">
                  <dt className="text-xs text-slate-400 uppercase">Referral ID</dt>
                  <dd className="font-medium text-slate-900">{referral.id}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                  <dt className="text-xs text-slate-400 uppercase">Name</dt>
                  <dd className="font-medium text-slate-900">{referral.name}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                  <dt className="text-xs text-slate-400 uppercase">Service Name</dt>
                  <dd className="font-medium text-slate-900">{referral.serviceName}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50">
                  <dt className="text-xs text-slate-400 uppercase">Date</dt>
                  <dd className="font-medium text-slate-900">{formatDate(referral.date)}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-xs text-slate-400 uppercase">Profit</dt>
                  <dd className="font-medium text-slate-900">{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ReferralDetail