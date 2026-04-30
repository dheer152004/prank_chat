import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaTelegram } from 'react-icons/fa';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <span className="text-2xl">🎭</span> PrankU
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/platforms" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Platforms
        </Link>
        <Link to="/platforms" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all">
          Create Now
        </Link>
      </div>
    </nav>
  );
}
