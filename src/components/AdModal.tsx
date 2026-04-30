import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onAdComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onAdComplete, onClose }: AdModalProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
        {timeLeft === 0 && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition rounded-full p-2"
            title="Cancel Export"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <h2 className="text-xl font-bold mb-4 mt-2 text-gray-800">Sponsor Message</h2>
        
        <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mb-6 overflow-hidden relative">
          {/* 
            TODO: ADD YOUR AD SCRIPT HERE 
            
            Example AdSense integration:
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          */}
          <p className="text-gray-400 font-medium text-center px-4">
            Ad space reserved.<br/>
            <span className="text-sm">(Insert your ad script here)</span>
          </p>
        </div>

        {timeLeft > 0 ? (
          <div className="w-full text-center">
            <p className="text-gray-600 font-medium pb-2">
              Your export will be ready in <span className="font-bold text-indigo-600">{timeLeft}</span> seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <button 
            onClick={onAdComplete}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
          >
            Start Download
          </button>
        )}
      </div>
    </div>
  );
}
