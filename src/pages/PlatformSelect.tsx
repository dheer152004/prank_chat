import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PLATFORMS } from '../constants';
import { FaWhatsapp, FaTwitter, FaFacebook, FaTelegram, FaArrowRight, FaInstagram, FaSnapchatGhost, FaRedditAlien, FaFire } from 'react-icons/fa';
import { Navbar } from '../components/Navbar';
import { SEO } from '../components/SEO';

const getIcon = (id: string, className: string) => {
  switch (id) {
    case 'whatsapp': return <FaWhatsapp className={className} />;
    case 'twitter': return <FaTwitter className={className} />;
    case 'facebook': return <FaFacebook className={className} />;
    case 'telegram': return <FaTelegram className={className} />;
    case 'instagram': return <FaInstagram className={className} />;
    case 'snapchat': return <FaSnapchatGhost className={className} />;
    case 'reddit': return <FaRedditAlien className={className} />;
    case 'tinder': return <FaFire className={className} />;
    case 'chatgpt': return <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" className={className} alt="ChatGPT" />;
    default: return null;
  }
};

export default function PlatformSelect() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO
        title="Choose a Platform"
        description="No sign up required. Pick WhatsApp, Instagram, and other apps to create high-quality mockup images and videos for pranking your friends."
        canonical="/platforms"
      />
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose a Platform</h1>
          <p className="text-lg text-gray-600">Select the social media format you want to create a fake message for.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PLATFORMS.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/compose/${platform.id}`}
                className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-100 transition-all group"
              >
                <div className={`p-4 rounded-xl text-white ${platform.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {getIcon(platform.id, 'w-8 h-8')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                    {platform.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    Create Message <FaArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
