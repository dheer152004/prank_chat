import React, { useEffect, useRef } from "react";
import { MessageData, ChatMessage } from "../../types";
import { FaArrowLeft, FaPhoneAlt, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile } from "react-icons/fa";
import { CheckDouble, CheckSingle } from "../../components/utils";
import { MapPin, FileText, UserPlus, FileAudio, IndianRupee, Phone, PhoneMissed, Video, Play, Ban, ReplyAll } from 'lucide-react';
import Keyboard from '../../components/Keyboard';

const renderMessageContent = (msg: ChatMessage, isDark: boolean, isMe: boolean) => {
  const type = msg.messageType || 'text';

  switch(type) {
    case 'image':
      return (
        <div className="flex flex-col gap-1 -mx-[8px] -mt-[6px] mb-1">
          <div className="w-full h-48 bg-gray-300 rounded-t-[14px] overflow-hidden relative">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} alt="attachment" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Image</div>
            )}
          </div>
          {msg.text && <span className="px-2">{msg.text}</span>}
        </div>
      );
    case 'video':
      return (
        <div className="flex flex-col gap-1 -mx-[8px] -mt-[6px] mb-1">
          <div className="w-full h-48 bg-gray-800 rounded-t-[14px] overflow-hidden relative flex items-center justify-center">
            {msg.attachmentUrl ? (
              <video src={msg.attachmentUrl} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Video</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3"><Play className="text-white w-6 h-6 fill-current" /></div>
            </div>
          </div>
          {msg.text && <span className="px-2">{msg.text}</span>}
        </div>
      );
    case 'gif':
      return (
        <div className="flex flex-col gap-1 -mx-[8px] -mt-[6px] mb-1">
          <div className="w-full h-48 bg-gray-800 rounded-t-[14px] overflow-hidden relative flex items-center justify-center">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} className="w-full h-full object-cover" alt="GIF" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">GIF</div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-sans tracking-wider">GIF</div>
          </div>
          {msg.text && <span className="px-2">{msg.text}</span>}
        </div>
      );
    case 'voice':
      return (
        <div className="flex items-center gap-3 py-1">
          <button className={`w-10 h-10 rounded-full flex items-center justify-center border-0 ${isDark ? 'bg-gray-700' : 'bg-white/20'}`}>
            <Play className={`w-5 h-5 ${isDark ? 'text-white' : (isMe ? 'text-[#3e7240]' : 'text-[#48719e]')} ml-1 fill-current`} />
          </button>
          <div className="flex flex-col flex-1">
            <div className={`w-24 h-5 flex items-center gap-[2px] opacity-70`}>
               {[...Array(12)].map((_,i) => <div key={i} className={`w-1.5 ${i%2===0?'h-4':'h-2'} ${isDark? 'bg-blue-300':'bg-blue-500'} rounded-full`}></div>)}
            </div>
            <span className={`text-[11px] opacity-80`}>{msg.text || '0:12'}</span>
          </div>
        </div>
      );
    case 'document':
      return (
        <div className={`flex items-center gap-3 py-1`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-blue-500' : 'bg-blue-500 text-white'}`}>
             <FileText className="w-6 h-6 text-white flex-shrink-0" />
          </div>
          <div className="flex flex-col overflow-hidden max-w-[150px]">
             <span className="truncate font-semibold text-sm">{msg.text || 'Document.pdf'}</span>
             <span className={`text-[12px] opacity-70 truncate`}>{msg.attachmentUrl || '2.4 MB'}</span>
          </div>
        </div>
      );
    case 'audioCall':
    case 'videoCall':
      return (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            {type === 'videoCall' ? <Video className="w-5 h-5 text-gray-500" /> : <Phone className="w-5 h-5 text-gray-500" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[15px]">{msg.text || (type === 'videoCall' ? 'Video call' : 'Voice call')}</span>
            <span className={`text-[12px] flex items-center gap-1 opacity-70`}>
               {msg.attachmentUrl || '2 mins'}
            </span>
          </div>
        </div>
      );
    case 'location':
      return (
        <div className="flex flex-col gap-1 -mx-[8px] -mt-[6px] mb-1">
          <div className="w-full h-32 bg-[#e5e3df] rounded-[14px] overflow-hidden relative flex items-center justify-center">
             <MapPin className="w-8 h-8 text-red-500" />
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=14&size=400x400')"} }></div>
          </div>
          {msg.text && <span className="px-2 mt-1 font-semibold">{msg.text}</span>}
          {msg.attachmentUrl && <span className="px-2 text-xs opacity-70">{msg.attachmentUrl}</span>}
        </div>
      );
    case 'contact':
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <UserPlus className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">{msg.text || msg.attachmentUrl || 'Contact'}</span>
              <span className="text-[12px] opacity-70">Contact</span>
            </div>
          </div>
        </div>
      );
    case 'payment':
      return (
        <div className="flex flex-col bg-[#00a884]/10 rounded-lg p-3 -mx-1 -mt-1">
          <div className="flex items-center justify-between mb-2">
             <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                <IndianRupee className="w-5 h-5" />
             </div>
             <span className="font-bold text-lg">{msg.text || '₹500'}</span>
          </div>
          <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded inline-block w-fit">Payment to {msg.attachmentUrl || 'Contact'}</span>
        </div>
      );
    case 'deleted':
      return (
        <div className={`flex items-center gap-1.5 opacity-60 italic text-[15px] ${isDark ? 'text-white' : 'text-black'}`}>
          <Ban className="w-4 h-4" />
          <span>{msg.text || (isMe ? 'You deleted this message' : 'This message was deleted')}</span>
        </div>
      );
    case 'text':
    default:
      return <span>{msg.text}</span>;
  }
};

export default function TelegramPreview({ data, updateMessage }: { data: MessageData, updateMessage?: (id: string, field: keyof ChatMessage, value: any) => void }) {
  const isDark = data.theme === 'dark';
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0f1b24]' : 'bg-[#98acc3]'}`}>
      
      {/* Telegram Header */}
      <div className={`px-4 pt-8 pb-2 flex items-center justify-between sticky top-0 z-10 shadow-sm ${isDark ? 'bg-[#212d3b] text-white' : 'bg-[#5b8daf] text-white'}`}>
        <div className="flex items-center gap-4">
          <FaArrowLeft className="w-4 h-4 cursor-pointer" />
          <div className="flex items-center gap-3">
            <img src={data.profilePic} alt={data.senderName} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col justify-center gap-0">
              <span className="font-semibold text-[15px] leading-[1.2] tracking-wide truncate max-w-[120px]">{data.senderName}</span>
              <span className={`text-[12px] leading-[1.2] ${isDark ? 'text-[#7d8bb3]' : 'text-[#d0e5f5]'}`}>{data.statusText || 'last seen recently'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <FaPhoneAlt className="w-[18px] h-[18px] cursor-pointer" />
          <FaEllipsisV className="w-[18px] h-[18px] cursor-pointer" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col relative">
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 pointer-events-none ${data.bgUrl ? 'opacity-100' : 'opacity-30'}`}
          style={{
            backgroundImage: data.bgUrl ? `url('${data.bgUrl}')` : "radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0%, rgba(233, 226, 226, 0.28) 90%)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        {data.chatMessages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className="flex flex-col w-full z-10 relative group">
              {msg.dateMarker && (
                <div className="flex justify-center my-3 relative z-10 w-full">
                  <span className={`text-[12px] font-medium px-2 py-0.5 rounded-[12px] shadow-sm ${isDark ? 'bg-[#212d3b] text-white' : 'bg-black/20 text-white'}`}>
                    {msg.dateMarker}
                  </span>
                </div>
              )}
              <div className={`flex flex-col w-full ${msg.reaction ? 'mb-4' : 'mb-1'}`}>
                <div 
                  className={`max-w-[80%] rounded-[14px] px-3 pt-2 pb-[6px] shadow-sm relative text-[1em] leading-snug whitespace-pre-wrap
                  ${isMe ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}
                  ${isDark ? (isMe ? 'bg-[#2b5278] text-white' : 'bg-[#182533] text-white') : (isMe ? 'bg-[#e3ffc8] text-black' : 'bg-white text-black')}
                `}
              >
                <div className="flex flex-col relative max-w-full">
                  {msg.isForwarded && (
                    <div className="flex items-center gap-1 mb-1 mt-[-2px]">
                      <ReplyAll className="w-3.5 h-3.5 scale-x-[-1]" />
                      <div className="flex flex-col leading-tight">
                        <span className={`text-[12px] font-medium ${isDark ? 'text-[#6fc5f6]' : 'text-[#44b76a]'}`}>Forwarded message</span>
                      </div>
                    </div>
                  )}
                  {msg.replyToText !== undefined && (
                    <div className={`pl-2 mb-1 mt-0.5 flex flex-col border-l-2 text-sm ${isDark ? 'border-[#6fc5f6]' : 'border-[#44b76a]'}`}>
                      <span className={`text-[12px] font-medium ${isDark ? 'text-[#6fc5f6]' : 'text-[#44b76a]'}`}>{msg.sender === 'me' ? data.senderName : 'You'}</span>
                      <span className={`text-[13px] truncate ${isDark ? 'text-white' : 'text-black'}`}>{msg.replyToText || 'Message'}</span>
                    </div>
                  )}
                  {renderMessageContent(msg, isDark, isMe)}
                  <div className={`float-right mt-[5px] ml-3 -mb-1 flex items-center gap-[2px] ${isDark ? 'text-[#6dc4ff]' : 'text-[#44b76a]'}`}>
                  <span className={`text-[11px] font-medium ${isDark ? (isMe ? 'text-[#6fc5f6]' : 'text-[#708499]') : (isMe ? 'text-[#5ca172]':'text-[#a1aab3]')} mr-[2px]`}>
                    {msg.time}
                  </span>
                  {isMe && (
                    <span className="w-4 h-4 ml-[-2px] mb-[-1px]">
                        {msg.status === 'sent' && <CheckSingle />}
                        {(msg.status === 'delivered' || msg.status === 'read') && <CheckDouble isRead={msg.status === 'read'} />}
                    </span>
                  )}
                </div>
                <div className="clear-both"></div>
                </div>
                {msg.reaction && (
                  <div className={`absolute -bottom-[12px] px-2 py-[2px] rounded-full text-[13px] shadow-sm z-10 flex items-center justify-center border
                    ${isMe ? 'right-2' : 'left-2'} 
                    ${isDark ? 'bg-[#182533] border-[#1c242d]' : 'bg-white border-[#e3e3e3]'} 
                  `}>
                    {msg.reaction}
                  </div>
                )}
              </div>
            </div>
           </div>
          );
        })}
      </div>

      {/* Telegram Input Footer */}
      <div className={`flex items-end gap-3 px-3 py-2 shadow-[0_-1px_2px_rgba(0,0,0,0.05)] pt-2 pb-[env(safe-area-inset-bottom,20px)] mt-auto z-10 ${isDark ? 'bg-[#1c242d]' : 'bg-white'}`}>
        <FaSmile className={`w-[24px] h-[24px] mb-[6px] shrink-0 ${isDark ? 'text-[#7b8b9b]' : 'text-[#87939e]'}`} />
        <div ref={textInputRef} className={`flex-1 min-w-0 max-h-[108px] overflow-y-auto text-[17px] leading-[22px] py-1 ${(isDark || data.replayTypingText) ? 'text-white' : 'text-black'} break-words whitespace-pre-wrap`}>
            {typeof data.replayTypingText === 'string' ? data.replayTypingText : <span className={`text-[17px] ${isDark ? 'text-[#7b8b9b]' : 'text-[#9faab5]'}`}>Message</span>}
        </div>
        <FaPaperclip className={`w-[22px] h-[22px] mb-[6px] shrink-0 transform -rotate-45 ${isDark ? 'text-[#7b8b9b]' : 'text-[#87939e]'}`} />
        <div className="w-[36px] h-[36px] mt-0.5 rounded-full flex items-center justify-center shrink-0">
          {typeof data.replayTypingText === 'string' ? (
             <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#2b5278]' : 'bg-[#40A7E3]'}`}>
               <svg viewBox="0 0 24 24" width="16" height="16" className="fill-white translate-x-[1px]"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
             </div>
          ) : (
            <FaMicrophone className={`w-[22px] h-[22px] ${isDark ? 'text-[#7b8b9b]' : 'text-[#87939e]'}`} />
          )}
        </div>
      </div>
      
      {typeof data.replayTypingText === 'string' && (
         <Keyboard activeKey={data.typingKey} isDark={isDark} />
      )}
    </div>
  );
}
