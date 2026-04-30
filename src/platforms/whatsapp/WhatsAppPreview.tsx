import React, { useEffect, useRef } from "react";
import { MessageData, ChatMessage } from "../../types";
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaArrowLeft, FaCamera, FaMicrophone, FaPlus } from "react-icons/fa";
import { CheckDouble, CheckSingle } from "../../components/utils";
import { MapPin, FileText, UserPlus, FileAudio, IndianRupee, Phone, PhoneMissed, Video, Play, Ban, ReplyAll } from 'lucide-react';
import Keyboard from '../../components/Keyboard';

const renderMessageContent = (msg: ChatMessage, isDark: boolean, isMe: boolean) => {
  const type = msg.messageType || 'text';
  const textClass = `flex flex-col`;
  const subTextClass = `text-[12px] opacity-80 mt-1`;

  switch(type) {
    case 'image':
      return (
        <div className="flex flex-col gap-1 -mx-1 -mt-1">
          <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden relative">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} alt="attachment" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Image</div>
            )}
          </div>
          {msg.text && <span className="px-1">{msg.text}</span>}
        </div>
      );
    case 'video':
      return (
        <div className="flex flex-col gap-1 -mx-1 -mt-1">
          <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center">
            {msg.attachmentUrl ? (
              <video src={msg.attachmentUrl} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Video</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3"><Play className="text-white w-6 h-6 fill-current" /></div>
            </div>
          </div>
          {msg.text && <span className="px-1">{msg.text}</span>}
        </div>
      );
    case 'gif':
      return (
        <div className="flex flex-col gap-1 -mx-1 -mt-1">
          <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden relative flex items-center justify-center">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} className="w-full h-full object-cover" alt="GIF" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">GIF</div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-sans tracking-wider">GIF</div>
          </div>
          {msg.text && <span className="px-1">{msg.text}</span>}
        </div>
      );
    case 'voice':
      return (
        <div className="flex items-center gap-3 py-1">
          <button className={`w-10 h-10 rounded-full flex items-center justify-center border-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Play className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'} ml-1 fill-current`} />
          </button>
          <div className="flex flex-col flex-1">
            <div className={`w-24 h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mb-1 opacity-50`}></div>
            <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{msg.text || '0:12'}</span>
          </div>
          {isMe && <div className="w-8 h-8 rounded-full bg-green-500/20"><img src={msg.attachmentUrl || "https://ui-avatars.com/api/?name=Me&background=random"} alt="me" className="w-full h-full rounded-full" /></div>}
          {!isMe && <div className="w-8 h-8 rounded-full bg-gray-300"><img src={msg.attachmentUrl || "https://ui-avatars.com/api/?name=Them&background=random"} alt="them" className="w-full h-full rounded-full" /></div>}
        </div>
      );
    case 'document':
      return (
        <div className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? (isMe ? 'bg-[#004b3d]' : 'bg-[#182229]') : (isMe ? 'bg-[#c6f3c1]' : 'bg-[#f0f2f5]')}`}>
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
             <FileText className="w-6 h-6 text-orange-500 flex-shrink-0" />
          </div>
          <div className="flex flex-col overflow-hidden max-w-[150px]">
            <span className="truncate font-semibold text-sm">{msg.text || 'Document.pdf'}</span>
            <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>{msg.attachmentUrl || '2.4 MB • PDF'}</span>
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
            <span className={`text-[12px] flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
               {msg.attachmentUrl || 'Tap to return call'}
            </span>
          </div>
        </div>
      );
    case 'location':
      return (
        <div className="flex flex-col gap-1 -mx-1 -mt-1">
          <div className="w-full h-32 bg-[#e5e3df] rounded-lg overflow-hidden relative flex items-center justify-center">
             <MapPin className="w-8 h-8 text-red-500" />
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=14&size=400x400')"} }></div>
          </div>
          {msg.text && <span className="px-1 text-sm font-semibold">{msg.text}</span>}
          {msg.attachmentUrl && <span className="px-1 text-xs opacity-70 truncate">{msg.attachmentUrl}</span>}
        </div>
      );
    case 'contact':
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-3 pb-2 border-b border-white/20">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <UserPlus className="w-5 h-5 text-gray-500" />
            </div>
            <span className="font-semibold text-[15px]">{msg.text || msg.attachmentUrl || 'Contact'}</span>
          </div>
          <div className="pt-2 text-center text-sm font-semibold text-blue-500 cursor-pointer">Message</div>
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

export default function WhatsAppPreview({ data, updateMessage }: { data: MessageData, updateMessage?: (id: string, field: keyof ChatMessage, value: any) => void }) {
  const isDark = data.theme === 'dark';
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  const bgImage = isDark 
    ? 'opacity-[0.04]' 
    : 'opacity-[0.08]';
    
  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`}>
      
      {/* WhatsApp Header */}
      <div className={`px-3 pt-8 pb-3 flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-[#0f1f27]' : 'bg-[#008069]'} text-white`}>
        <div className="flex items-center gap-2">
          <FaArrowLeft className="w-4 h-4 cursor-pointer" />
          <div className="flex items-center gap-2 ml-1">
            <img src={data.profilePic} alt={data.senderName} className="w-9 h-9 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="font-semibold text-[15px] leading-tight" style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px'}}>{data.senderName}</span>
              <span className={`text-[11px] leading-tight ${data.isTyping ? (isDark ? 'text-[#00a884] font-medium' : 'text-[#25D366] font-medium') : (isDark ? 'text-gray-300' : 'text-green-100')}`}>
                {data.isTyping ? 'typing...' : (data.statusText || 'online')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mr-1">
          <FaVideo className="w-[18px] h-[18px] cursor-pointer" />
          <FaPhoneAlt className="w-4 h-4 cursor-pointer" />
          <FaEllipsisV className="w-[18px] h-[18px] cursor-pointer" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col relative z-0">
        {/* Background Pattern */}
        <div 
          className={`absolute inset-0 pointer-events-none ${data.bgUrl ? 'opacity-100' : bgImage}`}
          style={{
            backgroundImage: `url('${data.bgUrl || 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'}')`,
            backgroundSize: data.bgUrl ? 'cover' : '300px',
            backgroundPosition: 'center',
            backgroundRepeat: data.bgUrl ? 'no-repeat' : 'repeat',
          }}
        ></div>
        
        {data.chatMessages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className="flex flex-col w-full relative group">
              {msg.dateMarker && (
                <div className="flex justify-center my-3 relative z-10 w-full">
                  <span className={`text-[11px] px-3 py-1 rounded-lg shadow-sm ${isDark ? 'bg-[#182229] text-[#8696a0]' : 'bg-white text-[#54656f]'}`}>
                     {msg.dateMarker.toUpperCase()}
                  </span>
                </div>
              )}
              <div className={`flex flex-col w-full mb-[2px] ${msg.reaction ? 'mb-4' : ''}`}>
                <div 
                  className={`max-w-[85%] rounded-xl px-2 pt-[6px] pb-1 shadow-sm relative leading-[1.25] text-[1em] whitespace-pre-wrap
                  ${isMe ? 'self-end rounded-tr-none' : 'self-start rounded-tl-none'}
                  ${isDark ? (isMe ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-[#1f2c34] text-[#e9edef]') : (isMe ? 'bg-[#d9fdd3] text-[#111b21]' : 'bg-white text-[#111b21]')}
                `}
              >
                <div className="flex flex-col relative max-w-full">
                  {msg.isForwarded && (
                    <div className={`flex items-center gap-1 mb-0.5 text-[12px] italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ReplyAll className="w-3.5 h-3.5 scale-x-[-1]" />
                      <span>Forwarded</span>
                    </div>
                  )}
                  {msg.replyToText !== undefined && (
                    <div className={`p-1.5 mb-1 mt-0.5 rounded flex flex-col border-l-4 text-sm ${isDark ? 'bg-black/20 border-[#00a884]' : 'bg-black/5 border-[#00a884]'}`}>
                      <span className={`text-[12px] font-medium ${isDark ? 'text-[#00a884]' : 'text-[#00a884]'}`}>{msg.sender === 'me' ? data.senderName : 'You'}</span>
                      <span className={`text-[13px] truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{msg.replyToText || 'Message'}</span>
                    </div>
                  )}
                  {renderMessageContent(msg, isDark, isMe)}
                  <div className="flex items-center justify-end gap-1 mt-1 float-right ml-3 -mb-1">
                    <span className={`text-[10px] ${isDark ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                      {msg.time}
                    </span>
                    {isMe && (
                      <span className="ml-[2px] w-4 h-4 self-end mb-[2px]">
                        {msg.status === 'sent' && <CheckSingle />}
                        {msg.status === 'delivered' && <CheckDouble isRead={false} />}
                        {msg.status === 'read' && <CheckDouble isRead={true} />}
                      </span>
                    )}
                  </div>
                  <div className="clear-both"></div>
                </div>
                {msg.reaction && (
                  <div className={`absolute -bottom-[12px] px-1.5 py-[2px] rounded-full text-[12px] shadow-sm z-10 flex items-center justify-center border
                    ${isMe ? 'right-2' : 'left-2'} 
                    ${isDark ? 'bg-[#1f2c34] border-[#0b141a]' : 'bg-white border-[#f0f2f5]'} 
                  `}>
                    {msg.reaction}
                  </div>
                )}
              </div>
            </div>
           </div>
          );
        })}
        {data.isTyping && (
          <div className="flex flex-col w-full relative">
            <div className={`max-w-[50%] rounded-xl px-4 py-2 shadow-sm self-start rounded-tl-none flex items-center gap-1.5 ${isDark ? 'bg-[#1f2c34]' : 'bg-white'}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Input Footer */}
      <div className={`flex items-end gap-2 px-2 pb-[env(safe-area-inset-bottom,20px)] pt-2 mt-auto z-10 ${isDark ? 'bg-[#0b141a]' : 'bg-[#f0f2f5]'}`}>
        <div className={`flex-1 rounded-[24px] flex items-end px-3 py-1.5 min-h-[44px] max-h-[120px] shadow-sm ${isDark ? 'bg-[#1f2c34]' : 'bg-white'}`}>
          <div className="w-6 h-6 mr-2 shrink-0 flex items-center justify-center mb-1">
            <svg viewBox="0 0 24 24" width="24" height="24" className={`${isDark ? 'text-[#8696a0]' : 'text-[#54656f]'} fill-current`}><path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
          </div>
          <div ref={textInputRef} className={`flex-1 min-w-0 max-h-[108px] overflow-y-auto text-[17px] leading-[22px] py-1 ${isDark ? 'text-white' : 'text-black'} break-words whitespace-pre-wrap`}>
            {typeof data.replayTypingText === 'string' ? data.replayTypingText : <span className={isDark ? 'text-[#8696a0]' : 'text-[#54656f]'}>Message</span>}
          </div>
          <div className="flex items-center gap-3 ml-2 mb-1 shrink-0">
            <svg viewBox="0 0 24 24" width="22" height="22" className={`shrink-0 transform rotate-[-45deg] ${isDark ? 'text-[#8696a0]' : 'text-[#54656f]'} fill-current`}><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.57.57 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
            <svg viewBox="0 0 24 24" width="22" height="22" className={`shrink-0 ${isDark ? 'text-[#8696a0]' : 'text-[#54656f]'} fill-current`}><path d="M12 21.05l-8.6-.33c-1.57-.06-1.55-2.22.02-2.26l8.58-.23c2.72-.07 2.76 4.19 0 4.23zM21.1 5.92l-4.14-1.28c-1.62-.5-2.58.55-2.2 2.14l.8 3.32c.57 2.37 3.99 2.17 4.1-.25l.39-4.18c.04-1.1-.38-2.61.85-2.61.35 0 .5.3.48.65l-.33 3.42c-.08.83-1.39.83-1.48 0zm-7.79 3.26l-1.3-3.64c-.45-1.25.96-2.18 2.05-1.57l3.25 1.8c1.1.61.76 2.37-.5 2.5l-3.5.31h.01c-.13-.01-.25 0-.31.02a.456.456 0 00-.31.02c-.01.07 0 .19.16.63l.97 2.71c.42 1.18-.94 2.15-2.02 1.54l-3.32-1.85c-.96-.54-2.16-1.61-1.85-2.67l.82-2.73c.31-1.04 1.76-1.29 2.53-.41l.9 1.02c.8.9 2.56.09 2.34-1.18-.1-.58-.58-1-.87-1.11-1.02-.4-2.29-1.93-1.67-3.13z"></path></svg>
            <FaCamera className={`w-[20px] h-[20px] shrink-0 ${isDark ? 'text-[#8696a0]' : 'text-[#54656f]'}`} />
          </div>
        </div>
        <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 shadow-sm ${isDark ? 'bg-[#00a884]' : 'bg-[#00a884]'}`}>
          {typeof data.replayTypingText === 'string' ? (
            <svg viewBox="0 0 24 24" width="24" height="24" className="fill-[#0b141a]"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
          ) : (
            <FaMicrophone className="text-[#0b141a] w-[20px] h-[20px]" />
          )}
        </div>
      </div>
      {typeof data.replayTypingText === 'string' && (
         <Keyboard activeKey={data.typingKey} isDark={isDark} />
      )}
    </div>
  );
}
