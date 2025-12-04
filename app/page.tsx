export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to Cullinan Hotel
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience luxury and comfort at our 5-star hotel in the heart of the city.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Hotel Booking System
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">5-Star Luxury</h3>
            <p className="text-gray-600">Premium accommodations</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-4">🏨</div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Prime Location</h3>
            <p className="text-gray-600">Heart of downtown</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Best Rates</h3>
            <p className="text-gray-600">Competitive pricing</p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/book" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Book Your Stay
          </a>
          <p className="mt-4 text-gray-500">
            Contact: info@cullinanhotel.com | +1-555-0123
          </p>
        </div>
      </div>
    </div>
  )
}
