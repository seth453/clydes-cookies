import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error

      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function addToCart(product) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-amber-800">Loading... </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-3">
            🍪 Clyde's Cookies
          </h1>
          <nav className="flex gap-8 text-lg">
            <span className="cursor-pointer hover:text-amber-600">Shop</span>
            <span className="cursor-pointer hover:text-amber-600">Schedule Pickup</span>
            <span 
              className="cursor-pointer hover:text-amber-600"
              onClick={() => setShowCart(!showCart)}
            >
              Cart ({cart.length})
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-amber-800 text-white py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Fresh Baked Daily</h2>
        <p className="text-xl max-w-md mx-auto">Order online • Choose your pickup time • Straight from the oven to you</p>
      </div>
      
      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-amber-900 mb-10 text-center">Our Delicious Cookies</h2>

        {products.length === 0 ? (
          <p className="text-center text-xl text-amber-700">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={product.image_url || "https://www.bettycrocker.com/recipes/homemade-chocolate-chip-cookies/77c14e03-d8b0-4844-846d-f19304f61c57"} 
                  alt={product.name}
                  className="w-full h-64 object-contain bg-gray-100"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-amber-900 mb-2">{product.name}</h3>
                  <p className="text-amber-700 line-clamp-3 mb-6">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold text-amber-800">
                      ${Number(product.price).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-2xl font-medium transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
     {/* Shopping cart */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-30 flex justify-end" onClick={() => setShowCart(false)}>
          <div
            className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold text-amber-900">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-3xl">✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center py-12 text-xl text-amber-700">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-6">
                      <img
                        src={item.image_url || 'https://picsum.photos/id/1080/100'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-amber-700">${Number(item.price).toFixed(2)}</p>

                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border rounded hover:bg-amber-100"
                          >
                            −
                          </button>
                          <span className="font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border rounded hover:bg-amber-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 text-xl font-bold flex justify-between">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button className="mt-8 w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl text-lg font-medium">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App