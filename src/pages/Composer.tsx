import React, { useState, useRef, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import EmojiPicker from 'emoji-picker-react';
import { Heart } from 'lucide-react';
import { MessageData, ChatMessage } from '../types';
import { PLATFORMS } from '../constants';
import WhatsAppPreview from '../platforms/whatsapp/WhatsAppPreview';
import TwitterPreview from '../platforms/twitter/TwitterPreview';
import FacebookPreview from '../platforms/facebook/FacebookPreview';
import TelegramPreview from '../platforms/telegram/TelegramPreview';
import SnapchatPreview from '../platforms/snapchat/SnapchatPreview';
import InstagramPreview from '../platforms/instagram/InstagramPreview';
import RedditPreview from '../platforms/reddit/RedditPreview';
import TinderPreview from '../platforms/tinder/TinderPreview';
import ChatGPTPreview from '../platforms/chatgpt/ChatGPTPreview';
import { Wifi, Bluetooth, SignalHigh, Mail, Youtube, AlarmClock } from 'lucide-react';
import AdModal from '../components/AdModal';

import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix';

const DEVICE_SIZES = [
  { id: 'default', name: 'Default App', width: 320, height: 640 },
  { id: 'iphone14', name: 'iPhone 14', width: 390, height: 844 },
  { id: 'samsung-ultra', name: 'Samsung Ultra', width: 412, height: 915 },
  { id: 'pixel7', name: 'Pixel 7', width: 412, height: 892 },
];

export default function Composer() {
  const { platform } = useParams<{ platform: string }>();
  const isValidPlatform = PLATFORMS.some((p) => p.id === platform);

  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(-1);
  const [replayTypingText, setReplayTypingText] = useState<string | null>(null);
  const [replayTypingKey, setReplayTypingKey] = useState<string | null>(null);
  const [replayTime, setReplayTime] = useState<string | null>(null);
  const [replayHiddenReactions, setReplayHiddenReactions] = useState<Set<string>>(new Set());
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedVideoExt, setRecordedVideoExt] = useState<string | null>(null);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [typingSpeedMultiplier, setTypingSpeedMultiplier] = useState(1);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingExportFormat, setPendingExportFormat] = useState<'png' | 'jpeg' | 'svg' | 'video' | null>(null);

  const handleExportSelect = (format: 'png' | 'jpeg' | 'svg' | 'video') => {
    setPendingExportFormat(format);
    setShowAdModal(true);
  };

  const handleAdComplete = () => {
    setShowAdModal(false);
    if (pendingExportFormat) {
      exportImage(pendingExportFormat);
      setPendingExportFormat(null);
    }
  };

  const handleAdClose = () => {
    setShowAdModal(false);
    setPendingExportFormat(null);
  };

  const exportVideo = async () => {
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      
      const targetNode = previewRef.current;
      const targetWidth = 1080;
      const scale = targetWidth / targetNode.offsetWidth;
      const targetHeight = targetNode.offsetHeight * scale;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const dest = audioCtx.createMediaStreamDestination();
      
      const playSound = (type: 'normal' | 'modifier' | 'special' | 'sent' | 'received') => {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        if (type === 'normal') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);
          filter.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
          osc.start(now);
          osc.stop(now + 0.02);
        } else if (type === 'modifier') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);
          filter.frequency.setValueAtTime(2000, now);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.015);
          osc.start(now);
          osc.stop(now + 0.015);
        } else if (type === 'special') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);
          filter.frequency.setValueAtTime(1500, now);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
        } else if (type === 'sent') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
          filter.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'received') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659.25, now); // E5
          filter.frequency.setValueAtTime(2000, now);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(filter);
          filter.connect(gain2);
          gain2.connect(dest);
          gain2.connect(audioCtx.destination);
          
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, now + 0.15); // A5
          gain2.gain.setValueAtTime(0, now + 0.15);
          gain2.gain.linearRampToValueAtTime(0.5, now + 0.17);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          
          osc2.start(now + 0.15);
          osc2.stop(now + 0.4);
        }
      };

      const stream = canvas.captureStream(30);
      dest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
      
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 5000000 });
      } catch (e) {
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        } catch (e2) {
          recorder = new MediaRecorder(stream); 
        }
      }
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const ext = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
        
        setIsExporting(false);
        setIsReplaying(false);
        setReplayIndex(-1);
        setRecordedVideoUrl(url);
        setRecordedVideoExt(ext);
      };
      
      recorder.start();
      
      // Start Replay
      setIsReplaying(true);
      setReplayIndex(0);
      
      let animationFrameId: number;
      let isRecordingFrame = true;
      let isRendering = false;
      let frameResolvers: (() => void)[] = [];
      const renderFrame = async () => {
        if (!isRecordingFrame) return;
        if (!isRendering) {
          isRendering = true;
          try {
            const dataUrl = await htmlToImage.toJpeg(targetNode, { quality: 1, pixelRatio: scale, skipFonts: true, filter: (node) => node.id !== 'camera-notch' });
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              isRendering = false;
              const pending = frameResolvers;
              frameResolvers = [];
              pending.forEach(r => r());
            };
            img.src = dataUrl;
          } catch (e) {
            console.error(e);
            isRendering = false;
            const pending = frameResolvers;
            frameResolvers = [];
            pending.forEach(r => r());
          }
        }
        animationFrameId = requestAnimationFrame(renderFrame);
      };
      
      renderFrame();

      const waitForSync = async () => {
        await new Promise(r => setTimeout(r, 30)); // wait for React DOM flush
        if (isRendering) {
          await new Promise<void>(r => frameResolvers.push(r));
        }
        await new Promise<void>(r => frameResolvers.push(r));
      };

      const runReplay = async () => {
        let currentSimTime = data.statusBarTime || '9:41';
        setReplayTime(currentSimTime);
        
        let localReplayTime = currentSimTime;
        const timeInterval = setInterval(() => {
          let match = localReplayTime.match(/^(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?$/i);
          if (match) {
            let h = parseInt(match[1]);
            let m = parseInt(match[2]);
            let ampm = match[3];
            m += 1;
            if (m >= 60) {
              m = 0;
              h += 1;
              if (h === 12 && ampm) ampm = ampm.toUpperCase() === 'AM' ? 'PM' : 'AM';
              if (h > 12 && ampm) h -= 12;
              if (h >= 24) h = 0;
            }
            localReplayTime = `${h}:${m.toString().padStart(2, '0')}${ampm ? ' ' + ampm : ''}`;
            setReplayTime(localReplayTime);
          }
        }, 4000); // add 1 virtual minute every 4 seconds of recording

        const hiddenReactions = new Set<string>();
        data.chatMessages.forEach(m => {
          if (m.reaction) hiddenReactions.add(m.id);
        });
        setReplayHiddenReactions(new Set(hiddenReactions));

        for (let i = 0; i <= data.chatMessages.length; i++) {
          setReplayIndex(i);
          
          if (i > 0) {
            const prevMsg = data.chatMessages[i - 1];
            
            // Play sound when message appears
            if (prevMsg.sender === 'me') {
              playSound('sent');
            } else {
              playSound('received');
            }
            
            await waitForSync();
            
            if (prevMsg.reaction) {
               await new Promise(r => setTimeout(r, 1500)); // Delay before showing reaction
               hiddenReactions.delete(prevMsg.id);
               setReplayHiddenReactions(new Set(hiddenReactions));
               
               playSound('normal'); // soft sound for reaction
               await waitForSync();
            }
          }

          if (i < data.chatMessages.length) {
            const nextMsg = data.chatMessages[i];
            
            if (nextMsg.sender === 'me') {
              // Simulate typing
              const textArray = Array.from(nextMsg.text || '');
              await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); // wait before typing (simulating reading)
              setReplayTypingText('');
              await new Promise(r => setTimeout(r, 400)); // 400ms delay for keyboard opening
              let currentText = '';
              let currentKeyboardPage = 'alpha';
              const getKeyboardPage = (char: string) => {
                if (/^[a-zA-Z]$/.test(char)) return 'alpha';
                if (/^[0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]$/.test(char)) return 'numeric';
                if (char !== ' ' && char !== '\n') return 'emoji';
                return currentKeyboardPage; // keep current page for space
              };

              const delayScale = 1 / typingSpeedMultiplier;
              for (let j = 0; j < textArray.length; j++) {
                const char = textArray[j];
                const newKeyboardPage = getKeyboardPage(char);
                if (newKeyboardPage !== currentKeyboardPage && char !== ' ' && char !== '\n') {
                  currentKeyboardPage = newKeyboardPage;
                  await new Promise(r => setTimeout(r, 300 * delayScale)); // 300ms delay for changing keyboard page
                }
                currentText += char;
                setReplayTypingText(currentText);
                setReplayTypingKey(char);
                
                if (char === ' ') playSound('special');
                else playSound('normal');
                
                await waitForSync();
                
                await new Promise(r => setTimeout(r, (10 + Math.random() * 20) * delayScale)); // random typing speed (reduced since wait for sync adds delay)
                setReplayTypingKey(null);
                await new Promise(r => setTimeout(r, 10 * delayScale)); // key up briefly
              }
              await new Promise(r => setTimeout(r, 300 * delayScale)); // wait after typing
              setReplayTypingText(null);
              setReplayTypingKey(null);
            } else {
              // Their turn
              const textLength = nextMsg.text?.length || 10;
              const delayScale = 1 / typingSpeedMultiplier;
              await new Promise(r => setTimeout(r, (500 + Math.random() * 1000 + textLength * 20) * delayScale)); // length is dependent on text plus reading delay
            }
          } else {
            // Wait a moment at the end
            const delayScale = 1 / typingSpeedMultiplier;
            await new Promise(r => setTimeout(r, 1000 * delayScale));
          }
        }
        
        clearInterval(timeInterval);
        isRecordingFrame = false;
        cancelAnimationFrame(animationFrameId);
        setTimeout(() => {
          recorder.stop();
          setReplayTime(null);
        }, 500);
      };
      
      runReplay();
      
    } catch (error) {
      console.error('Failed to export video', error);
      alert('Failed to export video. Please try again.');
      setIsExporting(false);
      setIsReplaying(false);
      setReplayIndex(-1);
      setReplayTime(null);
    }
  };

  const exportImage = async (format: 'png' | 'jpeg' | 'svg' | 'video') => {
    if (format === 'video') {
      return exportVideo();
    }
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      // Let React layout settle before capture
      await new Promise(r => setTimeout(r, 100));
      
      const pixelRatio = 1080 / previewRef.current.clientWidth;
      const options = { 
        quality: 1, 
        backgroundColor: data.theme === 'dark' ? '#000000' : '#ffffff',
        pixelRatio,
        filter: (node: HTMLElement) => {
          // Filter out the notch and any interactive UI elements we don't want
          if (node.id === 'camera-notch') return false;
          return true;
        }
      };
      
      let dataUrl = '';
      
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(previewRef.current, options);
      } else if (format === 'jpeg') {
        dataUrl = await htmlToImage.toJpeg(previewRef.current, options);
      } else if (format === 'svg') {
        dataUrl = await htmlToImage.toSvg(previewRef.current, options);
      }
      
      const link = document.createElement('a');
      link.download = `${platform}-mockup-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const [deviceSize, setDeviceSize] = useState(DEVICE_SIZES[0]);
  const [customSize, setCustomSize] = useState({ width: 320, height: 640 });

  const [data, setData] = useState<MessageData>({
    senderName: 'John Carter',
    username: '@johncarter',
    profilePic: DEFAULT_AVATAR,
    message: 'Hey, this is a prank message! 🤣',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    readReceipt: 'read',
    platform: platform as MessageData['platform'],
    theme: 'light',
    likesCount: 1337,
    retweetsCount: 42,
    isVerified: true,
    feeling: '',
    chatMessages: [
      { id: '1', text: "Can't wait to see the new designs!", sender: 'them', time: '14:38', status: 'none', dateMarker: 'TODAY' },
      { id: '2', text: "Hey! Are we still on for the meeting at 3 PM today? Let me know if you need to reschedule.", sender: 'me', time: '14:42', status: 'read' },
    ]
  });

  if (!isValidPlatform) {
    return <Navigate to="/platforms" replace />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, bgUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMessage = (id: string, field: keyof ChatMessage, value: string) => {
    setData((prev) => ({
      ...prev,
      chatMessages: prev.chatMessages.map(msg => msg.id === id ? { ...msg, [field]: value } : msg)
    }));
  };

  const addMessage = () => {
    setData((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        { id: Date.now().toString(), text: 'New message', sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'none' }
      ]
    }));
  };

  const removeMessage = (id: string) => {
    setData((prev) => ({
      ...prev,
      chatMessages: prev.chatMessages.filter(m => m.id !== id)
    }));
  };

  return (
    <>
      <div className="h-screen bg-[#f0f2f5] flex font-sans text-gray-900 overflow-hidden w-full">
        {/* Left Sidebar: Nav replacement */}
        <aside className="w-20 shrink-0 bg-[#1a1c1e] flex flex-col items-center py-6 gap-6 border-r border-gray-800 overflow-y-auto no-scrollbar">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        
        {PLATFORMS.map((p) => (
          <Link 
            key={p.id}
            to={`/compose/${p.id}`} 
            className={`p-3 rounded-xl transition-colors flex items-center justify-center w-14 h-14 ${platform === p.id ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/50 opacity-50 grayscale hover:grayscale-0'}`}
          >
             {p.id === 'whatsapp' && <img src="https://img.icons8.com/color/48/whatsapp.png" className="w-8 h-8" alt="WhatsApp" />}
             {p.id === 'twitter' && <img src="https://img.icons8.com/color/48/twitter--v1.png" className="w-8 h-8" alt="Twitter" />}
             {p.id === 'facebook' && <img src="https://img.icons8.com/color/48/facebook-new.png" className="w-8 h-8" alt="Facebook" />}
             {p.id === 'telegram' && <img src="https://img.icons8.com/color/48/telegram-app.png" className="w-8 h-8" alt="Telegram" />}
             {p.id === 'snapchat' && <img src="https://img.icons8.com/color/48/snapchat.png" className="w-8 h-8" alt="Snapchat" />}
             {p.id === 'instagram' && <img src="https://img.icons8.com/color/48/instagram-new--v1.png" className="w-8 h-8" alt="Instagram" />}
             {p.id === 'reddit' && <img src="https://img.icons8.com/color/48/reddit.png" className="w-8 h-8" alt="Reddit" />}
             {p.id === 'tinder' && <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/TinderIcon-2017.svg" className="w-8 h-8" alt="Tinder" />}
             {p.id === 'chatgpt' && <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" className="w-8 h-8" alt="ChatGPT" />}
             {!['whatsapp', 'twitter', 'facebook', 'telegram', 'snapchat', 'instagram', 'reddit', 'tinder', 'chatgpt'].includes(p.id) && <span className="text-2xl font-bold">{p.name[0]}</span>}
          </Link>
        ))}

        <div className="mt-auto">
          <Link to="/" className="p-3 text-white/30 hover:text-white flex justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-800">PrankU Studio</h1>
            <p className="text-xs text-gray-500 font-medium">Creating realistic Mockups</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg">Save Draft</button>
            <div className="relative">
              <select
                value={typingSpeedMultiplier}
                onChange={(e) => setTypingSpeedMultiplier(Number(e.target.value))}
                disabled={isExporting}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg outline-none disabled:opacity-75 cursor-pointer appearance-none pr-8"
              >
                <option value={0.5}>0.5x Speed</option>
                <option value={1}>1x Speed</option>
                <option value={1.5}>1.5x Speed</option>
                <option value={2}>2x Speed</option>
                <option value={4}>4x Speed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleExportSelect(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                disabled={isExporting}
                className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 cursor-pointer appearance-none pr-10 outline-none disabled:opacity-75 disabled:cursor-wait"
              >
                <option value="">{isExporting ? 'Exporting...' : 'Export...'}</option>
                <option value="png">Download as PNG</option>
                <option value="jpeg">Download as JPEG</option>
                <option value="svg">Download as SVG</option>
                <option value="video">Export Video Replay</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </header>

        {/* Working Space */}
        <div className="flex-1 p-6 overflow-hidden h-full">
          <PanelGroup orientation="horizontal" className="gap-3 w-full h-full">
        
        {/* Left Column: Form Settings */}
        <Panel defaultSize={40} minSize={25} className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col relative h-full overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Message Composer</h2>
          </div>
          
          <SimpleBar 
            className="flex-1"
            style={{ minHeight: 0 }}
            autoHide={true}
          >
            <div className="p-6 space-y-5 pb-6">
            {/* Sender Details */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Participant Details</label>
              
              <div className="flex gap-3">
                <label className="w-12 h-12 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shrink-0 overflow-hidden relative group">
                  {data.profilePic && data.profilePic !== DEFAULT_AVATAR ? (
                    <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img src={DEFAULT_AVATAR} alt="Default" className="w-full h-full object-cover" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder={(platform === 'whatsapp' || platform === 'telegram' || platform === 'snapchat' || platform === 'instagram') ? "Contact Name" : "Display Name"}
                    value={data.senderName}
                    onChange={(e) => setData({ ...data, senderName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {(platform === 'twitter' || platform === 'telegram' || platform === 'instagram' || platform === 'snapchat' || platform === 'reddit') && (
                    <input
                      type="text"
                      placeholder="Username / Handle"
                      value={data.username}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}
                  {(platform === 'whatsapp' || platform === 'telegram' || platform === 'instagram' || platform === 'snapchat' || platform === 'facebook' || platform === 'reddit') && (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder={platform === 'reddit' ? "Post Title" : "Status (e.g. online, typing...)"}
                        value={data.statusText || ''}
                        onChange={(e) => setData({ ...data, statusText: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {['online', 'typing...', 'last seen recently', 'last seen today at 10:00'].map(status => (
                          <button
                            key={status}
                            onClick={() => setData({ ...data, statusText: status })}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conversation Builder for Chat Apps and Twitter */}
            {(platform === 'whatsapp' || platform === 'telegram' || platform === 'snapchat' || platform === 'instagram' || platform === 'twitter' || platform === 'facebook' || platform === 'reddit' || platform === 'tinder' || platform === 'chatgpt') && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">{platform === 'twitter' ? 'Replies (Conversation)' : 'Conversation'}</span>
                 </div>
                 <div className="space-y-3">
                   {data.chatMessages.map((msg) => (
                     <div key={msg.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-2 relative group">
                        {/* Reaction Button (Hover) */}
                        {platform !== 'twitter' && (
                          <div className="absolute -top-3 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setOpenPickerId(openPickerId === msg.id ? null : msg.id)}
                              className="bg-white border border-gray-200 shadow-sm rounded-full p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-colors"
                            >
                              <Heart size={16} />
                            </button>
                            {openPickerId === msg.id && (
                              <div className="absolute right-0 mt-2 z-50">
                                <div className="fixed inset-0" onClick={() => setOpenPickerId(null)} />
                                <div className="relative shadow-xl rounded-lg">
                                  <EmojiPicker 
                                    onEmojiClick={(emojiData) => {
                                      updateMessage(msg.id, 'reaction', emojiData.emoji);
                                      setOpenPickerId(null);
                                    }}
                                    width={280}
                                    height={350}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {platform !== 'twitter' && (
                          <div className="flex gap-2 items-center mb-1">
                             <input 
                               type="text" 
                               value={msg.dateMarker || ''}
                               onChange={(e) => updateMessage(msg.id, 'dateMarker', e.target.value)}
                               className="flex-1 px-2 py-1 border border-indigo-200 bg-indigo-50/50 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 placeholder-indigo-300"
                               placeholder="Start new date here (e.g. TODAY)"
                             />
                          </div>
                        )}
                        <div className="flex justify-between items-center pr-2">
                          <select 
                            value={msg.sender} 
                            onChange={(e) => updateMessage(msg.id, 'sender', e.target.value)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none cursor-pointer max-w-[130px] truncate"
                          >
                             <option value="them">From: {platform === 'twitter' ? `Post Author (${data.senderName})` : data.senderName}</option>
                             <option value="me">From: {platform === 'twitter' ? 'Random User (Auto)' : 'Me'}</option>
                          </select>
                          <select 
                            value={msg.messageType || 'text'} 
                            onChange={(e) => updateMessage(msg.id, 'messageType', e.target.value)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none cursor-pointer"
                          >
                             <option value="text">Text</option>
                             <option value="image">Image</option>
                             <option value="video">Video</option>
                             <option value="voice">Voice Note</option>
                             <option value="audioCall">Audio Call</option>
                             <option value="videoCall">Video Call</option>
                             <option value="document">Document</option>
                             <option value="location">Location</option>
                             <option value="contact">Contact</option>
                             <option value="payment">Payment</option>
                             <option value="gif">GIF</option>
                             {platform === 'instagram' && <option value="reel">Reel</option>}
                             <option value="deleted">Deleted</option>
                          </select>
                          <button onClick={() => removeMessage(msg.id)} className="text-red-500 hover:text-red-700 text-xs cursor-pointer font-medium hover:underline">Remove</button>
                        </div>
                        {msg.messageType && msg.messageType !== 'text' && (
                          <input 
                            type="text" 
                            value={msg.attachmentUrl || ''} 
                            onChange={(e) => updateMessage(msg.id, 'attachmentUrl', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500 mb-1"
                            placeholder="Attachment URL or specific data (e.g., duration for call)"
                          />
                        )}
                        {platform !== 'twitter' && msg.replyToText !== undefined && (
                          <input 
                            type="text" 
                            value={msg.replyToText} 
                            onChange={(e) => updateMessage(msg.id, 'replyToText', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 mb-1 bg-gray-50 italic"
                            placeholder="Quoted reply text..."
                          />
                        )}
                        {platform === 'twitter' && msg.sender === 'me' && (
                          <div className="flex flex-col gap-1 mb-1">
                            <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={msg.replyName || ''}
                                 onChange={(e) => updateMessage(msg.id, 'replyName', e.target.value)}
                                 className="flex-1 px-2 py-1 border border-indigo-200 bg-indigo-50/30 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                                 placeholder="Reply Name (Auto)"
                               />
                               <input 
                                 type="text" 
                                 value={msg.replyUsername || ''}
                                 onChange={(e) => updateMessage(msg.id, 'replyUsername', e.target.value)}
                                 className="flex-1 px-2 py-1 border border-indigo-200 bg-indigo-50/30 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                                 placeholder="@username (Auto)"
                               />
                            </div>
                            <input 
                               type="text" 
                               value={msg.replyProfilePic || ''}
                               onChange={(e) => updateMessage(msg.id, 'replyProfilePic', e.target.value)}
                               className="w-full px-2 py-1 border border-indigo-200 bg-indigo-50/30 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                               placeholder="Profile Pic URL (Auto)"
                             />
                          </div>
                        )}
                        <textarea 
                          value={msg.text} 
                          onChange={(e) => updateMessage(msg.id, 'text', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm resize-none outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={2}
                          placeholder={msg.messageType && msg.messageType !== 'text' ? "Caption/Filename/Contact Name..." : "Message content"}
                        />
                        <div className="flex flex-col gap-2 mt-1">
                           <div className="flex gap-2 flex-wrap">
                             <input 
                               type="text" 
                               value={msg.time}
                               onChange={(e) => updateMessage(msg.id, 'time', e.target.value)}
                               className="w-[80px] px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                               placeholder="Time"
                             />
                             {platform !== 'twitter' ? (
                               <input 
                                 type="text" 
                                 value={msg.reaction || ''}
                                 onChange={(e) => updateMessage(msg.id, 'reaction', e.target.value)}
                                 className="w-[60px] px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                                 placeholder="React"
                               />
                             ) : (
                               <input 
                                 type="text" 
                                 value={msg.reaction || ''}
                                 onChange={(e) => updateMessage(msg.id, 'reaction', e.target.value)}
                                 className="w-[80px] px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                                 placeholder="Likes (e.g. 1)"
                               />
                             )}
                             {platform !== 'twitter' && (
                               <label className="flex items-center justify-center cursor-pointer text-xs text-gray-600 bg-white border border-gray-200 rounded px-2 gap-1 px-2.5">
                                 <input 
                                   type="checkbox" 
                                   checked={msg.isForwarded || false} 
                                   onChange={(e) => updateMessage(msg.id, 'isForwarded', e.target.checked as any)}
                                 />
                                 Fwd
                               </label>
                             )}
                             {platform !== 'twitter' && (
                               <label className="flex items-center justify-center cursor-pointer text-xs text-gray-600 bg-white border border-gray-200 rounded px-2 gap-1 px-2.5">
                                 <input 
                                   type="checkbox" 
                                   checked={msg.replyToText !== undefined} 
                                   onChange={(e) => {
                                     if (e.target.checked) updateMessage(msg.id, 'replyToText', 'Previous message');
                                     else {
                                        setData((prev) => ({
                                          ...prev,
                                          chatMessages: prev.chatMessages.map((m) =>
                                            m.id === msg.id ? { ...m, replyToText: undefined } : m
                                          ),
                                        }));
                                     }
                                   }}
                                 />
                                 Reply
                               </label>
                             )}
                             {platform !== 'twitter' && msg.sender === 'me' && (
                               <select
                                 value={msg.status}
                                 onChange={(e) => updateMessage(msg.id, 'status', e.target.value)}
                                 className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer min-w-[100px]"
                               >
                                 <option value="none">Status: None</option>
                                 <option value="sent">Status: Sent</option>
                                 {platform === 'whatsapp' || platform === 'instagram' ? <option value="delivered">Status: Delivered</option> : null}
                                 <option value="read">Status: Read</option>
                               </select>
                             )}
                           </div>
                           {platform !== 'twitter' && (
                             <div className="flex gap-1 items-center bg-white border border-gray-200 rounded-md p-1 px-2 overflow-x-auto no-scrollbar">
                               <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Quick:</span>
                               {['👍', '❤️', '😂', '😮', '😢', '🙏', ''].map(emoji => (
                                 <button 
                                   key={emoji || 'none'}
                                   onClick={() => updateMessage(msg.id, 'reaction', emoji)}
                                   className={`w-6 h-6 flex items-center justify-center text-sm rounded hover:bg-gray-100 transition-colors ${msg.reaction === emoji ? 'bg-indigo-50 border border-indigo-200' : ''}`}
                                   title={emoji ? emoji : 'Clear'}
                                 >
                                   {emoji || '❌'}
                                 </button>
                               ))}
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
            
            {(platform === 'twitter' || platform === 'reddit') && (
              // Social Media Posts
              <>
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Post Content</label>
                  <textarea
                    rows={4}
                    value={data.message}
                    onChange={(e) => setData({ ...data, message: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Timestamp</label>
                    <input
                      type="text"
                      value={data.timestamp}
                      onChange={(e) => setData({ ...data, timestamp: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Likes</label>
                    <input
                      type="number"
                      value={data.likesCount}
                      onChange={(e) => setData({ ...data, likesCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  {platform === 'twitter' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Retweets</label>
                      <input
                        type="number"
                        value={data.retweetsCount}
                        onChange={(e) => setData({ ...data, retweetsCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Theme & Extras */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Advanced Settings</label>
              
              <div className="flex gap-4 mb-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Font Style</label>
                  <select 
                    value={data.fontFamily || 'Inter'}
                    onChange={(e) => setData({ ...data, fontFamily: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none"
                  >
                    <option value="Inter">Inter (Default)</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Font Size (px)</label>
                  <input
                    type="number"
                    value={data.fontSize || 15}
                    onChange={(e) => setData({ ...data, fontSize: parseInt(e.target.value) || 15 })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none"
                    min="10"
                    max="30"
                  />
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Device Status Bar</label>
                
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-gray-500">Time</label>
                    <input
                      type="text"
                      value={data.statusBarTime ?? '9:41'}
                      onChange={(e) => setData({ ...data, statusBarTime: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-gray-500">Battery (%)</label>
                    <input
                      type="number"
                      value={data.batteryPercentage ?? 100}
                      onChange={(e) => setData({ ...data, batteryPercentage: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 outline-none"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showNotch ?? true}
                      onChange={(e) => setData({...data, showNotch: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Camera Notch</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showCellular ?? true}
                      onChange={(e) => setData({...data, showCellular: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Cellular (Network)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showWifi ?? true}
                      onChange={(e) => setData({...data, showWifi: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showBattery ?? true}
                      onChange={(e) => setData({...data, showBattery: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Battery Icon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showBluetooth ?? false}
                      onChange={(e) => setData({...data, showBluetooth: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Bluetooth</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showVoLTE ?? false}
                      onChange={(e) => setData({...data, showVoLTE: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">VoLTE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showYoutube ?? false}
                      onChange={(e) => setData({...data, showYoutube: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">YouTube</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showGmail ?? false}
                      onChange={(e) => setData({...data, showGmail: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Gmail</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.showAlarm ?? false}
                      onChange={(e) => setData({...data, showAlarm: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Alarm Clock</span>
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2 pt-2 border-t border-gray-100">
                <input 
                  type="checkbox" 
                  checked={data.theme === 'dark'}
                  onChange={(e) => setData({...data, theme: e.target.checked ? 'dark' : 'light'})}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-sm text-gray-600">Enable Dark Mode</span>
              </label>

              {(platform === 'whatsapp' || platform === 'telegram' || platform === 'instagram' || platform === 'snapchat') && (
                <div className="mt-2 flex flex-col gap-2">
                  <label className="block text-xs font-medium text-gray-600">Chat Background</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={data.bgUrl || ''}
                      onChange={(e) => setData({ ...data, bgUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <label className="flex-1 text-center py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-xs font-medium text-gray-700 transition">
                        Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} />
                      </label>
                      <button
                        onClick={() => setData({ ...data, bgUrl: '' })}
                        className="px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(platform === 'twitter' || platform === 'facebook' || platform === 'instagram') && (
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={data.isVerified}
                    onChange={(e) => setData({...data, isVerified: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-gray-600">Verified Badge</span>
                </label>
              )}
              {platform === 'snapchat' && (
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={data.isBitmoji ?? false}
                    onChange={(e) => setData({...data, isBitmoji: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-gray-600">Use Bitmoji Avatar</span>
                </label>
              )}
              {platform === 'instagram' && (
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={data.isOnline ?? false}
                    onChange={(e) => setData({...data, isOnline: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-gray-600">Online Status</span>
                </label>
              )}

              {platform === 'instagram' && (
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={data.isNewChat || false}
                    onChange={(e) => setData({...data, isNewChat: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-gray-600">First Time Chat Layout</span>
                </label>
              )}

              {/* Chat Date / Activity */}
              {(platform === 'facebook' || platform === 'tinder' || platform === 'snapchat') && (
                <div className="mt-2 text-left">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Chat Date Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 21, 2023 at 3:00 PM"
                    value={data.chatDate || ''}
                    onChange={(e) => setData({ ...data, chatDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              {platform === 'tinder' && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-left">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tinder Actions</label>
                  
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input 
                      type="checkbox" 
                      checked={data.showUnmatchModal ?? false}
                      onChange={(e) => setData({...data, showUnmatchModal: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-sm text-gray-600">Show Unmatch Modal Mockup</span>
                  </label>

                  {!data.isUnmatched ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to unmatch ${data.senderName}? This will clear the chat history.`)) {
                          setData({ ...data, isUnmatched: true, chatMessages: [] });
                        }
                      }}
                      className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      Unmatch User
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setData({ ...data, isUnmatched: false });
                      }}
                      className="w-full px-3 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
                    >
                      Rematch User
                    </button>
                  )}
                </div>
              )}

              {platform === 'facebook' && (
                <div className="mt-2 text-left">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Feeling / Activity</label>
                  <input
                    type="text"
                    placeholder="e.g. feeling wonderful"
                    value={data.feeling}
                    onChange={(e) => setData({ ...data, feeling: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
          </SimpleBar>

          {(platform === 'whatsapp' || platform === 'telegram' || platform === 'instagram' || platform === 'snapchat' || platform === 'twitter' || platform === 'facebook' || platform === 'reddit' || platform === 'tinder' || platform === 'chatgpt') && (
            <div className="mt-auto p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-10 w-full">
               <button 
                 onClick={addMessage} 
                 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl text-base font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer"
               >
                 <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                 Add Message
               </button>
            </div>
          )}

        </Panel>

        <PanelResizeHandle className="w-2 transition-colors cursor-col-resize mx-1 hover:bg-gray-300 rounded-full hidden md:flex shrink-0 items-center justify-center relative group">
          <div className="h-8 w-1 bg-gray-300 rounded-full group-hover:bg-gray-500 transition-colors"></div>
        </PanelResizeHandle>

        {/* Right Column: Live Preview */}
        <Panel defaultSize={60} minSize={30} className="bg-gray-200/50 rounded-2xl border-2 border-dashed border-gray-300 relative overflow-hidden h-full">
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10 px-4 pointer-events-none">
             <span className="px-2 py-1 bg-white border border-gray-300 text-[10px] font-bold uppercase rounded-md text-gray-400 tracking-tighter">Live Render</span>
             <div className="flex flex-col gap-2 items-end pointer-events-auto">
               <select 
                 className="bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 px-3 py-1.5 outline-none shadow-sm cursor-pointer"
                 value={deviceSize.id}
                 onChange={(e) => {
                   const id = e.target.value;
                   if (id === 'custom') {
                     setDeviceSize({ id: 'custom', name: 'Custom', ...customSize });
                   } else {
                     const size = DEVICE_SIZES.find(s => s.id === id);
                     if (size) setDeviceSize(size);
                   }
                 }}
               >
                 {DEVICE_SIZES.map(size => (
                   <option key={size.id} value={size.id}>{size.name} ({size.width}x{size.height})</option>
                 ))}
                 <option value="custom">Custom Size</option>
               </select>

               {deviceSize.id === 'custom' && (
                 <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm">
                   <input 
                     type="number" 
                     className="w-14 text-xs outline-none text-center bg-transparent" 
                     value={customSize.width} 
                     onChange={e => {
                       const w = parseInt(e.target.value) || 0;
                       setCustomSize(prev => ({ ...prev, width: w }));
                       setDeviceSize(prev => ({ ...prev, width: w }));
                     }}
                   />
                   <span className="text-gray-400 text-xs">×</span>
                   <input 
                     type="number" 
                     className="w-14 text-xs outline-none text-center bg-transparent" 
                     value={customSize.height} 
                     onChange={e => {
                       const h = parseInt(e.target.value) || 0;
                       setCustomSize(prev => ({ ...prev, height: h }));
                       setDeviceSize(prev => ({ ...prev, height: h }));
                     }}
                   />
                 </div>
               )}
             </div>
          </div>
          
          <SimpleBar 
            className="w-full h-full" 
            autoHide={true} 
          >
            <div className="pt-24 pb-12 flex flex-col items-center min-h-full">
            <div 
              style={{ width: `${deviceSize.width}px`, height: `${deviceSize.height}px`, minHeight: `${deviceSize.height}px` }}
              className="shrink-0 flex-none bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 flex flex-col relative overflow-hidden transition-all duration-300"
            >
              <div 
                ref={previewRef}
                className="w-full h-full flex flex-col relative"
                style={{ backgroundColor: data.theme === 'dark' ? '#000000' : '#ffffff' }}
              >
            <div className={`min-h-[24px] w-full absolute top-0 z-50 flex items-start pt-1.5 justify-between px-6 pointer-events-none ${data.theme === 'dark' ? 'text-white' : 'text-black'}`}>
               <div className="flex items-center gap-1.5 mt-0.5 z-10 w-1/3">
                 <span className="text-[12px] font-semibold tracking-tight leading-none translate-y-[1px]">{data.statusBarTime ?? '9:41'}</span>
                 {data.showYoutube && <Youtube className="w-3.5 h-3.5 -mt-[1px]" />}
                 {data.showGmail && <Mail className="w-3 h-3 -mt-[1px]" />}
               </div>
               
               {/* Optional Camera Notch constraint */}
               {(data.showNotch ?? true) && (
                 <div id="camera-notch" className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl shadow-sm z-50 flex items-center justify-end px-2">
                   <div className="w-3 h-3 bg-gray-800 rounded-full border border-gray-700/50 flex shadow-inner">
                     <div className="w-1 h-1 bg-white/20 rounded-full m-auto"></div>
                   </div>
                 </div>
               )}

               <div className="flex gap-1.5 items-center mt-0.5 z-10 w-1/3 justify-end">
                 {data.showAlarm && <AlarmClock className="w-3.5 h-3.5" />}
                 {data.showVoLTE && <span className="text-[9px] font-bold tracking-tighter">VoLTE</span>}
                 {data.showBluetooth && <Bluetooth className="w-3.5 h-3.5" />}
                 {(data.showWifi ?? true) && <Wifi className="w-3.5 h-3.5" />}
                 {(data.showCellular ?? true) && <SignalHigh className="w-3.5 h-3.5" />}
                 <div className="flex items-center gap-0.5">
                   {typeof data.batteryPercentage !== 'undefined' && <span className="text-[10px] font-semibold translate-y-[1px]">{data.batteryPercentage}%</span>}
                   {(data.showBattery ?? true) && (
                     <div className="relative w-[21px] h-[11px] border-[1.5px] rounded-[3px] border-current opacity-90 flex p-[1px] ml-0.5">
                       <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-current rounded-r-[1px] opacity-90"></div>
                       <div className="h-full bg-current rounded-[1px]" style={{ width: `${Math.min(Math.max((data.batteryPercentage ?? 100), 0), 100)}%` }}></div>
                     </div>
                   )}
                 </div>
               </div>
            </div>

            <div 
              style={{
                fontFamily: data.fontFamily !== 'Inter' ? `"${data.fontFamily}", sans-serif` : undefined,
                fontSize: data.fontSize ? `${data.fontSize}px` : undefined,
              }}
              className={`flex-1 overflow-y-auto w-full h-full no-scrollbar relative ${data.theme === 'dark' ? 'bg-black' : 'bg-white'}`}
            >
              {(() => {
                let displayData = data;
                if (isReplaying && replayIndex !== -1) {
                  const visibleMessages = data.chatMessages.slice(0, replayIndex).map(m => {
                    if (replayHiddenReactions.has(m.id)) {
                       return { ...m, reaction: undefined };
                    }
                    return m;
                  });
                  // Next message from 'them'?
                  const isTypingNext = replayIndex < data.chatMessages.length && data.chatMessages[replayIndex].sender === 'them';
                  displayData = { ...data, chatMessages: visibleMessages, isTyping: isTypingNext, replayTypingText, typingKey: replayTypingKey };
                  if (replayTime) {
                    displayData.statusBarTime = replayTime;
                  }
                }

                if (platform === 'whatsapp') return <WhatsAppPreview data={displayData} updateMessage={updateMessage} />;
                if (platform === 'twitter') return <TwitterPreview data={displayData} />;
                if (platform === 'facebook') return <FacebookPreview data={displayData} />;
                if (platform === 'telegram') return <TelegramPreview data={displayData} updateMessage={updateMessage} />;
                if (platform === 'snapchat') return <SnapchatPreview data={displayData} />;
                if (platform === 'instagram') return <InstagramPreview data={displayData} updateMessage={updateMessage} />;
                if (platform === 'reddit') return <RedditPreview data={displayData} />;
                if (platform === 'tinder') return <TinderPreview data={displayData} />;
                if (platform === 'chatgpt') return <ChatGPTPreview data={displayData} />;
                return null;
              })()}
            </div>
            </div>
          </div>
          </div>
          </SimpleBar>
        </Panel>
        
        </PanelGroup>
        </div>
      </main>

      {/* Video Preview Modal */}
      {recordedVideoUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md overflow-hidden flex flex-col shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-lg font-bold text-gray-900">Video Preview</h3>
               <button 
                 onClick={() => {
                   URL.revokeObjectURL(recordedVideoUrl);
                   setRecordedVideoUrl(null);
                 }}
                 className="text-gray-400 hover:text-gray-600 outline-none"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
            </div>
            <div className="relative w-full aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
               <video src={recordedVideoUrl} controls autoPlay muted loop className="w-full h-full object-contain"></video>
            </div>
            <div className="p-4 flex flex-col sm:flex-row items-center justify-end gap-3 bg-gray-50 border-t border-gray-100">
               <button 
                 onClick={() => {
                   URL.revokeObjectURL(recordedVideoUrl);
                   setRecordedVideoUrl(null);
                 }} 
                 className="w-full sm:w-auto px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 outline-none transition-colors"
               >
                 Discard
               </button>
               <button 
                 onClick={() => {
                    const a = document.createElement('a');
                    a.href = recordedVideoUrl;
                    a.download = `${platform}-replay-${Date.now()}.${recordedVideoExt}`;
                    a.click();
                    // We don't revoke here instantly because the download needs it,
                    setRecordedVideoUrl(null);
                 }}
                 className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 outline-none shadow-md shadow-indigo-200 transition-colors"
               >
                 Download Video
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <AdModal 
      isOpen={showAdModal} 
      onAdComplete={handleAdComplete} 
      onClose={handleAdClose} 
    />
    </>
  );
}
