import React, { useEffect } from 'react'

export default function CheckoutModal({
  showCheckout,
  customerInfo,
  setCustomerInfo,
  cartTotal,
  setShowCheckout,
  submitOrder,
  isSubmitting,
}) {
  useEffect(() => {
    if (!showCheckout) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !isSubmitting) setShowCheckout(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showCheckout, isSubmitting, setShowCheckout])

  if (!showCheckout) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
        onClick={() => !isSubmitting && setShowCheckout(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-scale-in"
      >
        <h2 id="checkout-title" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
          Checkout
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter your details and choose a pickup time.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="customer-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="customer-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="pickup-time" className="mb-1.5 block text-sm font-medium text-slate-700">
              Pickup time
            </label>
            <input
              id="pickup-time"
              type="datetime-local"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              value={customerInfo.pickupTime}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, pickupTime: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-lg font-bold text-slate-900">
          <span>Total</span>
          <span className="text-emerald-700">${cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowCheckout(false)}
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-slate-200 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitOrder}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            {isSubmitting ? 'Redirecting…' : 'Proceed to payment'}
          </button>
        </div>
      </div>
    </div>
  )
}