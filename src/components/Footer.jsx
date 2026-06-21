function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-sm">
        <span className="text-indigo-600 font-semibold">Go Business</span>
        <nav aria-label="Footer" className="flex gap-4 text-slate-500">
          <a href="#">About</a>
          <a href="#">Privacy</a>
        </nav>
        <span className="text-slate-400">© 2024 Go Business</span>
      </div>
    </footer>
  )
}

export default Footer