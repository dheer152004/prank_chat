import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PLATFORMS } from '../constants';
import { Navbar } from '../components/Navbar';
import { SEO } from '../components/SEO';
import surpriseReactionImage from '../assets/images/image.png';
import creativeScenarioImage from '../assets/images/image1.png';

const platformImages: Record<string, string> = {
  whatsapp: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  twitter: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
  facebook: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
  telegram: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
  snapchat: 'https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg',
  instagram: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
  reddit: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Reddit_logo.svg',
  tinder: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/TinderIcon-2017.svg',
  chatgpt: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
};

const prankImages = [
  {
    url: surpriseReactionImage,
    title: 'Surprise Reactions',
    description: 'Capture the exact moment they realize they\'ve been fooled.'
  },
  {
    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    title: 'Shared Laughs',
    description: 'Perfect for group chats and inside jokes with close friends.'
  },
  {
    url: creativeScenarioImage,
    title: 'Hilarious Memories',
    description: 'Create unforgettable moments that everyone will talk about.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEO
        title="Create free Social Media Mockups and fake chat images and videos"
        description="No sign up required. Create high-quality mockup images and videos for WhatsApp, Instagram, and other apps to prank your friends."
        canonical="/"
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 text-center max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Create <span className="text-blue-600">Realistic</span> Social Mocks.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Prank your friends with pixel-perfect mockups of popular social media conversations. Fast, customizable, and watermark-free.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/platforms" className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Pranking Now
            </Link>
          </motion.div>
        </section>

        {/* Showcase Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported Platforms</h2>
              <p className="text-gray-500">We support the world's most popular messaging and social platforms.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {PLATFORMS.map((platform, index) => (
                <motion.div 
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 mb-4 transform group-hover:scale-110 transition-transform`}>
                    <img 
                      src={platformImages[platform.id]} 
                      alt={`${platform.name} logo`} 
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{platform.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fun Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unleash the Fun</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">See how people are using our tool to create hilarious scenarios and prank their close friends. It's all about sharing a good laugh!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {prankImages.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">SocialMock</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            The best tool to create highly realistic fake social media messages entirely for entertainment purposes. Please use responsibly.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SocialMock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
