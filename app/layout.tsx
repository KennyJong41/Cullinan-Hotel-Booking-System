import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cullinan Hotel - Luxury Accommodations',
  description: 'Book your stay at Cullinan Hotel - Luxury 5-star hotel offering premium accommodations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Cullinan Hotel</h3>
            <p className="text-gray-300">
              Luxury 5-star hotel offering premium accommodations and world-class service.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/rooms" className="hover:text-blue-300">Rooms & Suites</a></li>
              <li><a href="/amenities" className="hover:text-blue-300">Amenities</a></li>
              <li><a href="/contact" className="hover:text-blue-300">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              <li><a href="/cancellation" className="hover:text-blue-300">Cancellation Policy</a></li>
              <li><a href="/privacy" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-300">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-300">123 Luxury Avenue</p>
            <p className="text-gray-300">Downtown District</p>
            <p className="text-gray-300">Phone: +1-555-0123</p>
            <p className="text-gray-300">Email: info@cullinanhotel.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cullinan Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}