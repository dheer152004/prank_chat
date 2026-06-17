import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, ShieldAlert } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center border border-gray-100">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors self-start w-full">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Mail className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left border border-indigo-100 flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-indigo-600 shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Our Mission</h2>
            <p className="text-gray-700">
              This platform was built entirely for fun, creativity, and parody. There is <span className="font-bold">absolutely no intention to cause harm</span>, mislead, or offend anyone.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Reach out to us</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Whether you want to share a hilarious mockup you made, report a bug, or just say hi, feel free to drop us an email. Remember to always use the tool responsibly!
          </p>
          <a href="mailto:hello@example.com" className="inline-flex items-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30">
            Email Us <Heart className="w-5 h-5 ml-2" />
          </a>
        </div>
        
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          Our team usually responds within 24-48 hours. Please be kind!
        </p>
      </div>
    </div>
  );
}
