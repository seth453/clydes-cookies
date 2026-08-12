export default function CartSidebar({
  cart,
  updateQuantity,
  removeFromCart,
  cartTotal,
  setShowCart,
  handleCheckout,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Dark backdrop */}
      <div
        onClick={() => setShowCart(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      />

      {/* Sliding panel */}
      <aside
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#ecfdf5',
            padding: '20px 24px',
            borderBottom: '1px solid #d1fae5',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0 0', color: '#0f172a' }}>
                Your Cart
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowCart(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '999px',
                border: '1px solid #e3e3ec',
                background: 'black',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', fontSize: '13px' }}>
            <span style={{ background: 'white', padding: '4px 12px', borderRadius: '999px', fontWeight: 500 }}>
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
            <span style={{ background: '#d1fae5', padding: '4px 12px', borderRadius: '999px', fontWeight: 600, color: '#065f46' }}>
              ${Number(cartTotal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>🍪</p>
              <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>Your cart is empty</p>
              <button
                type="button"
                onClick={() => setShowCart(false)}
                style={{
                  marginTop: '16px',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  <img
                    src={item.image_url || 'https://picsum.photos/id/1080/100'}
                    alt=""
                    style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <p style={{ fontWeight: 600, margin: 0, color: '#0f172a' }}>{item.name}</p>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <p style={{ fontWeight: 700, color: '#047857', margin: 0 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Quantity controls*/}
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '999px',
                          border: '2px solid #cbd5e1',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          minWidth: '28px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#0f172a',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '999px',
                          border: '2px solid #cbd5e1',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#e11d48',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              <span>Total</span>
              <span style={{ color: '#047857' }}>${Number(cartTotal).toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              style={{
                width: '100%',
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              onClick={() => setShowCart(false)}
              style={{
                width: '100%',
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              Keep shopping
            </button>
          </div>
        )}
      </aside>

      {/* Keyframes for the slide */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}