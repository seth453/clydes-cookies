import React from 'react'

export default function Header({ itemCount, onCartOpen }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20 border-b">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-3">🍪 Clyde's Cookies</h1>
        </div>

        <button
          onClick={onCartOpen}
          className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-medium transition"
        >
          View Cart ({itemCount})
        </button>
      </div>
    </header>
  )
}
