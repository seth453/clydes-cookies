import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './Header'
import CartSidebar from './cart'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    pickupTime: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch {
        localStorage.removeItem('cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name')
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('payment') === 'success') {
    alert('Payment successful! We’ll see you at pickup.')
    //clear the query so it doesn’t alert again on refresh
    window.history.replaceState({}, '', window.location.pathname)
  }
}, [])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )
  const minPickupTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, qty) => {
    if (qty < 1) return
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    )
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowCart(true)
  }

  const submitOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.pickupTime) {
      alert('Please fill all fields.')
      return
    }
    if (!customerInfo.email.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    const pickupDate = new Date(customerInfo.pickupTime)
    if (Number.isNaN(pickupDate.getTime()) || pickupDate <= new Date()) {
      alert('Please choose a pickup time in the future.')
      return
    }

    // Make sure every item has a valid price + quantity before sending
    const cleanCart = cart.map((item) => {
      const price = Number(item.price)
      const quantity = parseInt(item.quantity, 10)

      if (!item.id) {
        throw new Error(`Missing product id for ${item.name || 'item'}`)
      }
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${item.name || 'item'}: ${item.price}`)
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Invalid quantity for ${item.name || 'item'}`)
      }

      return {
        id: item.id,
        name: item.name,
        price,           // float
        quantity,        // integer
      }
    })

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            cart: cleanCart,
            customerInfo: {
              name: customerInfo.name.trim(),
              email: customerInfo.email.trim(),
              pickupTime: customerInfo.pickupTime,
            },
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Unable to start checkout.')
      }

      if (!data?.url) throw new Error('No checkout URL returned.')

      setCart([])
      setCustomerInfo({ name: '', email: '', pickupTime: '' })
      setShowCart(false)
      window.location.assign(data.url)
    } catch (err) {
      console.error('Checkout error:', err)
      alert(err.message || 'Unable to start checkout.')
    } finally {
      setIsSubmitting(false)
    }
  }

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5efe7] text-[#2d1f1a]">
      <Header itemCount={itemCount} onCartOpen={() => setShowCart(true)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-10 rounded-[2rem] border border-[#d7c2aa] bg-[#fffaf5]/90 p-6 shadow-[0_18px_45px_rgba(72,42,28,0.08)] sm:p-10">
          <h2 className="text-3xl font-bold text-[#2d1f1a] sm:text-4xl lg:text-5xl">
            Fresh cookies made in Dallas, OR.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#5a4338]">
            Small-batch cookies baked fresh for pickup in Dallas & Salem.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-[#2d1f1a]">Our Delicious Cookies</h2>
          <div className="grid gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#e3d1b5] bg-[#fffaf5] shadow-[0_14px_30px_rgba(74,45,30,0.08)] md:flex-row"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-56 w-full object-cover md:h-auto md:w-72"
                />
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#2d1f1a]">{product.name}</h3>
                    <p className="mt-2 text-[#5a4338]">{product.desc}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#2d1f1a]">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-2xl bg-[#5c3527] px-6 py-3 font-semibold text-[#fffaf5] transition hover:bg-[#472d22] disabled:bg-[#c9b7a3]"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/*FLOATING CART BUTTON*/}
      <button
        type="button"
        onClick={() => setShowCart(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#5c3527',
          color: '#fffaf5',
          padding: '14px 20px',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 25px rgba(58,38,29,0.22)',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '22px' }}>🛒</span>
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontSize: '11px', opacity: 0.85, textTransform: 'uppercase' }}>
            Your cart
          </div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} · ${cartTotal.toFixed(2)}
          </div>
        </div>
        {itemCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#e11d48',
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
              minWidth: '22px',
              height: '22px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {showCart && (
        <CartSidebar
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          setShowCart={setShowCart}
          handleCheckout={handleCheckout}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          submitOrder={submitOrder}
          isSubmitting={isSubmitting}
          minPickupTime={minPickupTime}
        />
      )}
    </div>
  )
}

export default App