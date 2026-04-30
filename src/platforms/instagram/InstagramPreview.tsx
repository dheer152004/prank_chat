import React, { useEffect, useRef } from "react";
import { MessageData, ChatMessage } from "../../types";
import { ChevronLeft, Info, Phone, Video, Camera, Mic, Image as ImageIcon, Heart, SmilePlus, PlusCircle } from 'lucide-react';
import Keyboard from '../../components/Keyboard';

const renderMessageContent = (msg: ChatMessage, isDark: boolean, isMe: boolean) => {
  const type = msg.messageType || 'text';

  switch(type) {
    case 'image':
      return (
        <div className="flex flex-col mb-1">
          <div className="w-full h-48 bg-gray-300 rounded-[14px] overflow-hidden relative">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} alt="attachment" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Image</div>
            )}
          </div>
          {msg.text && <span className="pt-1 px-1">{msg.text}</span>}
        </div>
      );
    case 'video':
    case 'gif':
    case 'reel':
      return (
        <div className={`flex flex-col mb-1 ${type === 'reel' ? 'min-w-[200px]' : ''}`}>
          <div className={`w-full ${type === 'reel' ? 'h-80' : 'h-48'} bg-gray-800 rounded-[14px] overflow-hidden relative flex items-center justify-center`}>
            {msg.attachmentUrl ? (
              type === 'gif' ? <img src={msg.attachmentUrl} className="w-full h-full object-cover" alt="GIF" /> :
              <video src={msg.attachmentUrl} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
                 {type === 'gif' ? 'GIF' : type === 'reel' ? <><Video className="w-8 h-8 mb-2 opacity-50" /><span>Reel</span></> : 'Video'}
              </div>
            )}
            {type === 'reel' && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 drop-shadow-md">
                 <Video className="w-4 h-4 text-white fill-current" />
                 <span className="text-white text-xs font-semibold">Reel</span>
              </div>
            )}
          </div>
          {msg.text && <span className="pt-1 px-1">{msg.text}</span>}
        </div>
      );
    case 'voice':
      return (
        <div className="flex items-center gap-2 py-1">
          <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? (isDark ? 'bg-white' : 'bg-black') : (isDark ? 'bg-gray-800' : 'bg-gray-200')} transition-colors`}>
            <div className={`w-3 h-3 translate-x-[1px] ${isMe ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-white' : 'text-black')}`} style={{clipPath: 'polygon(0 0, 0 100%, 100% 50%)', backgroundColor: 'currentColor'}}></div>
          </button>
          <div className="flex-1 flex gap-0.5 max-w-[120px]">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`flex-1 rounded-full ${isMe ? (isDark ? 'bg-white/40' : 'bg-white/40') : (isDark ? 'bg-gray-600' : 'bg-gray-400')}`} style={{height: `${Math.max(20, Math.random() * 100)}%`}}></div>
            ))}
          </div>
          <span className="text-xs ml-1 font-mono">0:00</span>
        </div>
      );
    case 'audioCall':
      return (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{msg.text || (msg.sender === 'me' ? 'Outgoing Call' : 'Incoming Call')}</span>
            <span className="text-xs opacity-70">Tap to call back</span>
          </div>
        </div>
      );
    case 'videoCall':
      return (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <Video className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{msg.text || (msg.sender === 'me' ? 'Outgoing Video Call' : 'Incoming Video Call')}</span>
            <span className="text-xs opacity-70">Tap to call back</span>
          </div>
        </div>
      );
    case 'deleted':
      return (
        <div className="flex items-center gap-2 italic opacity-60">
          <span>This message is no longer available</span>
        </div>
      );
    default:
      return <span>{msg.text}</span>;
  }
};

const InstagramPreview = ({ data, updateMessage }: { data: MessageData, updateMessage?: (id: string, field: keyof ChatMessage, value: any) => void }) => {
  const isDark = data.theme === 'dark';
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Header */}
      <div className={`flex items-center px-4 pb-3 pt-9 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <button className="mr-4">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <div className="flex items-center flex-1 gap-3">
          <div className="relative">
            <img 
              src={data.profilePic} 
              alt={data.senderName} 
              className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
            />
            {data.isOnline && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-[#78de45] rounded-full border-[2.5px] ${isDark ? 'border-black' : 'border-white'}`}></div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[15px]">{data.senderName}</span>
              {data.isVerified && (
                <svg aria-label="Verified" className="w-[14px] h-[14px] text-[#0095f6]" fill="currentColor" viewBox="0 0 40 40"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
              )}
            </div>
            <span className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{data.username || 'Active 1h ago'}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Phone className="w-6 h-6" />
          <Video className="w-6 h-6" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col">
        {data.isNewChat && (
          <div className={`flex flex-col items-center justify-center pt-8 pb-10 gap-1`}>
            <div className="relative mb-2">
              <img src={data.profilePic} className="w-24 h-24 rounded-full object-cover" alt="Profile" />
              {data.isOnline && (
                <div className={`absolute bottom-0 right-1 w-6 h-6 bg-[#78de45] rounded-full border-[3px] ${isDark ? 'border-black' : 'border-white'}`}></div>
              )}
            </div>
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-1">
                 <span className="font-semibold text-[18px]">{data.senderName}</span>
                 {data.isVerified && (
                   <svg aria-label="Verified" className="w-4 h-4 text-[#0095f6]" fill="currentColor" viewBox="0 0 40 40"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                 )}
               </div>
               <span className={`text-[14px] ${isDark ? 'text-white' : 'text-black'} font-medium`}>{data.username || 'Instagram'}</span>
               <span className={`text-[14px] ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Instagram</span>
               <span className={`text-[14px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You both follow each other</span>
             </div>
             <button className={`mt-3 px-4 py-1.5 rounded-lg font-semibold text-[14px] ${isDark ? 'bg-[#363636] text-white hover:bg-[#404040]' : 'bg-[#efefef] text-black hover:bg-[#dbdbdb]'} transition-colors cursor-pointer`}>View profile</button>
          </div>
        )}

        {data.chatDate && !data.isNewChat && (
          <div className="flex justify-center mb-6">
            <span className={`text-[#8e8e8e] text-xs font-semibold uppercase tracking-wider`}>{data.chatDate}</span>
          </div>
        )}

        <div className="flex flex-col gap-[2px] pb-2">
          {data.chatMessages.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            const showProfilePic = !isMe && (idx === data.chatMessages.length - 1 || data.chatMessages[idx + 1].sender === 'me');
            
            const prevMsg = idx > 0 ? data.chatMessages[idx - 1] : null;
            const nextMsg = idx < data.chatMessages.length - 1 ? data.chatMessages[idx + 1] : null;

            const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender || prevMsg.dateMarker != null || msg.dateMarker != null;
            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender || nextMsg.dateMarker != null || msg.dateMarker != null;

            const tl = !isMe && !isFirstInGroup ? '4px' : '22px';
            const tr = isMe && !isFirstInGroup ? '4px' : '22px';
            const bl = !isMe && !isLastInGroup ? '4px' : '22px';
            const br = isMe && !isLastInGroup ? '4px' : '22px';
            const borderRadius = `${tl} ${tr} ${br} ${bl}`;

            return (
              <div key={msg.id} className={!isFirstInGroup ? "mt-[2px]" : "mt-3"}>
                {msg.dateMarker && (
                   <div className="flex justify-center my-4">
                     <span className={`text-[#8e8e8e] text-xs font-semibold uppercase tracking-wider`}>{msg.dateMarker}</span>
                   </div>
                )}
                <div className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                  {msg.isForwarded && (
                    <div className={`text-[12px] italic mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1`}>
                      <span className="scale-x-[-1] tracking-tighter">➥</span> Forwarded
                    </div>
                  )}

                  <div className={`flex items-end gap-2 max-w-[75%] group ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <div className="w-7 h-7 flex-shrink-0">
                        {showProfilePic ? (
                          <img src={data.profilePic} alt="profile" className="w-7 h-7 rounded-full object-cover" />
                        ) : null}
                      </div>
                    )}
                    
                    <div className="flex flex-col relative max-w-full">
                      {msg.replyToText !== undefined && (
                        <div className={`mb-1 px-3 py-2 rounded-2xl text-[13px] opacity-70 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
                           <span className="font-semibold block mb-0.5">{msg.sender === 'me' ? data.senderName : 'You'}</span>
                           <span className="truncate block">{msg.replyToText || 'Message'}</span>
                        </div>
                      )}
                      
                      <div 
                        className={`
                          px-[15px] py-[10px] text-[15px] leading-[1.35] break-words relative
                          ${msg.messageType === 'deleted' 
                             ? (isDark ? 'border border-gray-700 text-gray-500' : 'border border-gray-300 text-gray-500')
                             : (isMe ? 'text-white' : (isDark ? 'bg-[#262626] text-white' : 'bg-[#efefef] text-black'))
                          }
                        `}
                        style={{
                          borderRadius: borderRadius,
                          ...(isMe && msg.messageType !== 'deleted' ? { 
                            background: '#3797f0',
                          } : {})
                        }}
                      >
                        {renderMessageContent(msg, isDark, isMe)}
                      </div>
                      
                      {msg.reaction && (
                        <div className={`absolute -bottom-3 ${isMe ? '-left-2' : '-right-2'} text-base bg-${isDark ? 'gray-900' : 'white'} border ${isDark ? 'border-gray-800' : 'border-gray-200'} rounded-full px-1.5 py-0.5 z-10 shadow-sm`}>
                          {msg.reaction}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isMe && msg.status === 'read' && idx === data.chatMessages.length - 1 && (
                    <div className="text-[11px] text-[#8e8e8e] mt-1 mr-1">Seen</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {data.isTyping && (
          <div className="flex flex-col w-full relative mt-2 items-start pl-9">
            <div className={`max-w-[50%] rounded-2xl px-4 py-[14px] shadow-sm flex items-center gap-1.5 ${isDark ? 'bg-[#262626]' : 'bg-[#efefef]'}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`flex items-end gap-2 px-3 pt-2 pb-[env(safe-area-inset-bottom,20px)] mt-auto z-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="w-[42px] h-[40px] flex-shrink-0 flex items-center justify-center bg-[#3797f0] rounded-[24px] overflow-hidden relative shadow-sm mb-1">
          <Camera className="w-[22px] h-[22px] text-white absolute" style={{ fill: 'white' }} strokeWidth={1} />
        </div>
        <div className={`flex-1 flex max-h-[120px] rounded-[24px] px-3.5 py-2.5 shadow-sm border ${isDark ? 'bg-[#262626] border-[#363636]' : 'bg-[#efefef] border-transparent'}`}>
          <div ref={textInputRef} className={`flex-1 min-w-0 max-h-[108px] overflow-y-auto text-[15px] leading-[20px] ${(isDark || data.replayTypingText) ? 'text-white' : 'text-black'} break-words whitespace-pre-wrap`}>
            {typeof data.replayTypingText === 'string' ? data.replayTypingText : <span className={`text-[15px] ${isDark ? 'text-[#a8a8a8]' : 'text-[#8e8e8e]'}`}>Message...</span>}
          </div>
          <div className={`flex items-center gap-3.5 ml-2 mt-auto mb-[-2px] ${isDark ? 'text-white' : 'text-black'}`}>
            {typeof data.replayTypingText === 'string' ? (
              <span className="text-[#3797f0] font-semibold text-[15px] px-1 hover:text-white cursor-pointer">Send</span>
            ) : (
              <>
                <Mic className="w-[22px] h-[22px]" strokeWidth={2} />
                <ImageIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                <SmilePlus className="w-[22px] h-[22px]" strokeWidth={2} />
                <PlusCircle className="w-[22px] h-[22px]" strokeWidth={2} />
              </>
            )}
          </div>
        </div>
      </div>
      
      {typeof data.replayTypingText === 'string' && (
         <Keyboard activeKey={data.typingKey} isDark={isDark} />
      )}
    </div>
  );
};

export default InstagramPreview;
