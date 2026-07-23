import React from 'react'

export default function CartSidebar({ cart, updateQuantity, removeFromCart, cartTotal, setShowCart, handleCheckout }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={() => setShowCart(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="ml-auto w-full max-w-md h-full bg-white shadow-2xl overflow-auto rounded-l-3xl ring-1 ring-slate-200"
      >
        <div className="bg-amber-50 rounded-l-3xl p-6 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">Cart Preview</p>
              <h3 className="text-2xl font-bold text-slate-900">Your Cart</h3>
            </div>
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setShowCart(false)}
              className="rounded-full border border-slate-200 bg-white w-10 h-10 text-lg text-slate-700 hover:bg-slate-100 transition"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white/80 px-3 py-1 font-medium">Items: {cart.length}</span>
            <span className="rounded-full bg-white/60 px-3 py-1">Total: ${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-600">Your cart is empty</div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border p-3 bg-white">
                  <img
                    src={item.image_url || 'https://picsum.photos/id/1080/100'}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover border"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">${Number(item.price).toFixed(2)}</p>
                      </div>
                      <div className="text-sm font-semibold text-amber-700">x{item.quantity}</div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border bg-white text-slate-700 hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border bg-white text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t mt-2">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
