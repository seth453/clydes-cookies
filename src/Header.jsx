export default function Header({ itemCount, onCartOpen }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#dcc4a1] bg-[#fffaf5]/90 shadow-[0_8px_22px_rgba(58,38,29,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#2a1d18] sm:text-3xl">
          🍪 Clyde's Cookies
        </h1>
        <button
          type="button"
          onClick={onCartOpen}
          className="rounded-full border border-[#d7b998] bg-[#f3e3d1] px-4 py-2 text-sm font-semibold text-[#2a1d18] transition hover:bg-[#e9d2b2]"
        >
          Cart ({itemCount})
        </button>
      </div>
    </header>
  )
}