import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6 md:p-12">
      <SEO
        title="Privacy Policy"
        description="Read SocialMock's privacy policy and learn how the app handles your data."
        canonical="/privacy"
      />
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information Collection</h2>
            <p className="bg-gray-50 p-4 rounded-xl text-gray-600 border border-gray-100">Our application is built entirely for fun and entertainment purposes. We do not collect, store, or process any personal data on our servers. All images and content you generate remain locally on your device.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Third-Party Services</h2>
            <p>We do not integrate with privacy-invasive third-party tracking services. However, if ads are displayed (e.g., to support server costs), those ad networks may collect anonymized data as governed by their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Local Storage</h2>
            <p>We may use local storage in your web browser to save temporary project states, configurations, or draft mockups to improve your user experience across sessions. This data never leaves your browser.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Intended Use</h2>
            <p>This service is strictly for generating mockups and parody content. We hold absolutely no intention for harm or anything else malicious. Please respect the privacy of real individuals and do not use this tool to dox, impersonate, or harass.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
