import React from 'react'

export default function CheckoutModal({ showCheckout, customerInfo, setCustomerInfo, cartTotal, setShowCheckout, submitOrder }) {
  if (!showCheckout) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border rounded-2xl"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border rounded-2xl"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full p-4 border rounded-2xl"
            value={customerInfo.pickupTime}
            onChange={(e) => setCustomerInfo({ ...customerInfo, pickupTime: e.target.value })}
          />
        </div>

        <div className="flex justify-between text-xl font-bold mb-8">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={() => setShowCheckout(false)}
            className="w-full sm:flex-1 py-4 border rounded-3xl"
          >
            Cancel
          </button>
          <button
            onClick={submitOrder}
            className="w-full sm:flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-3xl"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
