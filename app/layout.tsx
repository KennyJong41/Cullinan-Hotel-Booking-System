import './globals.css'

export const metadata = {
  title: 'Cullinan Hotel',
  description: 'Luxury hotel booking system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* 简单的导航栏 */}
          <nav className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-white rounded"></div>
                <h1 className="text-2xl font-bold">Cullinan Hotel</h1>
              </div>
              <div className="space-x-4">
                <a href="/" className="hover:text-blue-200">Home</a>
                <a href="/rooms" className="hover:text-blue-200">Rooms</a>
                <a href="/book" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Book Now</a>
              </div>
            </div>
          </nav>
          
          {children}
          
          {/* 简单的页脚 */}
          <footer className="bg-gray-800 text-white p-8 mt-8">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Cullinan Hotel. All rights reserved.</p>
              <p className="text-gray-400 mt-2">123 Luxury Avenue, Downtown District</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
