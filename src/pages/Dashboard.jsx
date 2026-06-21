import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { DollarSign, CreditCard, Paperclip, Hourglass, Percent, Users, ArrowLeftRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const REFERRALS_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'
const PAGE_SIZE = 10

const METRIC_ICONS = {
  'Total Balance': DollarSign,
  'Discount Percentage': CreditCard,
  'Total Referral': Paperclip,
  'Discount Amount': Hourglass,
  'Commission Amount': Percent,
  'Commission Discount': Users,
  'Total Bank Transfer': ArrowLeftRight,
}

function MetricIcon({ label }) {
  if (label === 'Total Earning') {
    return <span className="text-base leading-none">🪙</span>
  }
  const Icon = METRIC_ICONS[label]
  if (Icon) {
    return <Icon className="w-4 h-4 text-white" />
  }
  return <span className="text-white text-xs font-bold">{label?.charAt(0)}</span>
}

const formatDate = (isoDate) => (isoDate ? isoDate.replace(/-/g, '/') : '')

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
const formatProfit = (amount) => currencyFormatter.format(amount)

function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const token = Cookies.get('jwt_token')
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (sort) params.set('sort', sort)
        const url = params.toString() ? `${REFERRALS_URL}?${params.toString()}` : REFERRALS_URL

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const responseJson = await response.json()

        if (!response.ok) {
          throw new Error(
            responseJson.message
              ? `${responseJson.message} (${response.status})`
              : `Something went wrong (${response.status})`
          )
        }

        if (isMounted) {
          setData(responseJson.data)
          setPage(1)
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [search, sort])

  const referrals = data?.referrals || []
  const totalPages = Math.max(1, Math.ceil(referrals.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageRows = referrals.slice(startIndex, startIndex + PAGE_SIZE)
  const from = referrals.length === 0 ? 0 : startIndex + 1
  const to = Math.min(startIndex + PAGE_SIZE, referrals.length)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold text-slate-900">Referral Dashboard</h1>
        <p className="text-slate-500 mb-6">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {loading && <p className="text-slate-500">Loading...</p>}

        {error && (
          <p role="alert" className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            {error}
          </p>
        )}

        {data && (
          <>
            <section role="region" aria-label="Overview metrics" className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.metrics?.map((metric) => (
                  <div key={metric.id} className="border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
                      <MetricIcon label={metric.label} />
                    </div>
                    <p className="text-xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Service summary" className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Service summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Service</p>
                  <p className="font-medium text-indigo-600">{data.serviceSummary?.service}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Your Referrals</p>
                  <p className="font-medium text-slate-900">{data.serviceSummary?.yourReferrals}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Active Referrals</p>
                  <p className="font-medium text-slate-900">{data.serviceSummary?.activeReferrals}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Total Ref. Earnings</p>
                  <p className="font-medium text-slate-900">{data.serviceSummary?.totalRefEarnings}</p>
                </div>
              </div>
            </section>

            <section aria-label="Share referral" className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Refer friends and earn more</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Your Referral Link</p>
                  <div className="flex gap-2">
                    <input readOnly value={data.referral?.link || ''} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" />
                    <button onClick={() => navigator.clipboard.writeText(data.referral?.link || '')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Your Referral Code</p>
                  <div className="flex gap-2">
                    <input readOnly value={data.referral?.code || ''} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" />
                    <button onClick={() => navigator.clipboard.writeText(data.referral?.code || '')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">All referrals</h2>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Search</span>
                  <input
                    type="text"
                    aria-label="Search referrals"
                    placeholder="Name or service…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-500">
                  Sort by date
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Service</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-slate-400 py-6">
                        No matching entries
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/referral/${row.id}`)}
                        className="border-b border-slate-50 cursor-pointer hover:bg-slate-50"
                      >
                        <td className="py-3 pr-4 text-slate-900">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-600">{row.serviceName}</td>
                        <td className="py-3 pr-4 text-slate-600">{formatDate(row.date)}</td>
                        <td className="py-3 pr-4 text-indigo-600 font-medium">{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <p className="text-sm text-slate-400">
                  Showing {from}–{to} of {referrals.length} entries
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 text-sm rounded-lg ${
                        pageNum === currentPage
                          ? 'bg-indigo-500 text-white'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard