import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-amber-800">Loading fresh cookies... 🍪</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-amber-700">{error}</p>
          <p className="mt-4 text-sm">Make sure you created the "products" table and added some rows in Supabase.</p>
        </div>
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
            <span className="cursor-pointer hover:text-amber-600">Cart (0)</span>
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
                  src={product.image_url || "photos/blog-thumb-chewy-chocolate-chips-cookies.jpg"} 
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
                      onClick={() => alert(`Added ${product.name} to cart! (cart coming soon)`)}
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
    </div>
  )
}

export default App