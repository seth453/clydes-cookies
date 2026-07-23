import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './Header'
import CartSidebar from './cart'
import CheckoutModal from './CheckoutModal'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', pickupTime: '' })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('name')
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

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    )
  }

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id))

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowCart(false)
    setShowCheckout(true)
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

    const { data, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          pickup_time: customerInfo.pickupTime,
          total: cartTotal,
        },
      ])
      .select('id, customer_name, customer_email, pickup_time, total, created_at')

    if (orderError) {
      console.error('Order insert error:', orderError)

      const message = orderError.message?.includes('row-level security')
        ? 'The database is blocking new orders because the table policies are not set up yet. Please run the SQL in src/orders.sql in Supabase.'
        : `Couldn't place order: ${orderError.message}`

      alert(message)
      return
    }

    const order = Array.isArray(data) ? data[0] : data
    if (!order?.id) {
      const fallbackOrderId = crypto.randomUUID()
      const orderItems = cart.map((item) => ({
        order_id: fallbackOrderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemError } = await supabase.from('order_items').insert(orderItems)

      if (itemError) {
        console.error('Order item insert error:', itemError)
        alert(`Order items failed: ${itemError.message}`)
        return
      }

      alert('Order placed successfully!')
      setCart([])
      setCustomerInfo({ name: '', email: '', pickupTime: '' })
      setShowCheckout(false)
      return
    }

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemError } = await supabase.from('order_items').insert(orderItems)

    if (itemError) {
      console.error('Order item insert error:', itemError)
      alert(`Order items failed: ${itemError.message}`)
      return
    }

    alert('Order placed successfully!')
    setCart([])
    setCustomerInfo({ name: '', email: '', pickupTime: '' })
    setShowCheckout(false)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        <div className="animate-spin h-12 w-12 border-4 border-amber-600 rounded-full border-t-transparent" />
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50">
      <Header itemCount={itemCount} onCartOpen={() => setShowCart(true)} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="rounded-[2rem] bg-white/80 p-10 shadow-lg shadow-slate-200 mb-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="mt-4 text-5xl font-bold text-slate-900">
                Cookies made from scratch, ready for pickup.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Browse our menu, add your favorites to the cart, and choose a pickup time. Every order is baked fresh and wrapped with care.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
                <span className="rounded-full bg-amber-100 px-4 py-2">Fast pickup - </span>
                <span className="rounded-full bg-amber-100 px-4 py-2">Local ingredients - </span>
                <span className="rounded-full bg-amber-100 px-4 py-2">Daily fresh batches</span>
              </div>
            </div>
            <div className="rounded-3xl bg-amber-50 p-6 shadow-inner shadow-amber-100">
              <div className="mt-6 space-y-4 text-slate-700">
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-4xl font-bold text-slate-900">Our Delicious Cookies</h2>
          <div className="grid gap-8">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl md:flex-row"
              >
                <img
                  src={product.image_url || '/public/photos/pbchoc.jfif'}
                  alt={product.name}
                  className="h-72 w-full object-cover md:h-auto md:w-80"
                />
                <div className="flex flex-1 flex-col justify-between gap-6 p-8">
                  <div>
                    <h3 className="mt-4 text-3xl font-bold text-slate-900">{product.name}</h3>
                    <p className="mt-4 text-slate-600 leading-7">
                      {product.desc}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">${Number(product.price).toFixed(2)}</p>
                      {product.stock === 0 ? (
                        <p className="mt-2 text-sm text-red-600">Sold out</p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">{product.stock} available</p>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="rounded-3xl bg-amber-600 px-8 py-4 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {product.stock === 0 ? 'Sold out' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showCart && (
        <CartSidebar
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          setShowCart={setShowCart}
          handleCheckout={handleCheckout}
        />
      )}

      <CheckoutModal
        showCheckout={showCheckout}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        cartTotal={cartTotal}
        setShowCheckout={setShowCheckout}
        submitOrder={submitOrder}
      />
    </div>
  )
}

export default App
