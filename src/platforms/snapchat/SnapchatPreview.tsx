import React, { useEffect, useRef } from "react";
import { MessageData, ChatMessage } from "../../types";
import { ChevronLeft, MoreHorizontal, Video, Phone, Camera, Mic, Image as ImageIcon, Smile, FileText, SendHorizontal } from 'lucide-react';
import { FaSnapchatGhost } from 'react-icons/fa';
import Keyboard from '../../components/Keyboard';

const renderMessageContent = (msg: ChatMessage, isDark: boolean, isMe: boolean) => {
  const type = msg.messageType || 'text';

  switch(type) {
    case 'image':
      return (
        <div className="flex flex-col gap-1 w-full max-w-[200px]">
          <div className="w-full h-[250px] bg-gray-200 rounded-xl overflow-hidden relative border-2 border-white shadow-sm">
            {msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} alt="attachment" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold uppercase tracking-widest opacity-60">Snap</span>
              </div>
            )}
            <div className="absolute top-2 right-2 text-white/80 font-bold bg-black/20 px-1 rounded font-mono text-sm">3s</div>
          </div>
          {msg.text && <span className="font-bold text-[15px] px-1">{msg.text}</span>}
        </div>
      );
    case 'video':
    case 'gif':
      return (
        <div className="flex flex-col gap-1 w-full max-w-[200px]">
          <div className="w-full h-[250px] bg-gray-200 rounded-xl overflow-hidden relative border-2 border-white shadow-sm">
            {msg.attachmentUrl ? (
              type === 'gif' ? <img src={msg.attachmentUrl} className="w-full h-full object-cover" alt="GIF" /> :
              <video src={msg.attachmentUrl} className="w-full h-full object-cover opacity-80" />
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                <Video className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold uppercase tracking-widest opacity-60">Snap</span>
              </div>
            )}
            <div className={`absolute top-2 left-2 ${type === 'gif' ? 'bg-[#fffc00] text-black' : 'bg-[#e92754] text-white'} px-1 rounded text-xs font-bold uppercase tracking-wider`}>{type}</div>
          </div>
          {msg.text && <span className="font-bold text-[15px] px-1">{msg.text}</span>}
        </div>
      );
    case 'voice':
      return (
        <div className="flex items-center gap-2">
           <Mic className={`w-5 h-5 ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`} />
           <div className={`text-[15px] ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'} font-bold`}>Voice Note</div>
           <span className="text-xs opacity-50 ml-1 font-mono">0:00</span>
        </div>
      );
    case 'audioCall':
      return (
        <div className="flex items-center gap-2">
           <Phone className={`w-5 h-5 ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`} />
           <div className="flex flex-col leading-tight">
             <span className={`text-[15px] font-bold ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`}>{msg.text || (msg.sender === 'me' ? 'You called' : 'Missed Call')}</span>
           </div>
        </div>
      );
    case 'videoCall':
      return (
        <div className="flex items-center gap-2">
           <Video className={`w-5 h-5 ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`} />
           <div className="flex flex-col leading-tight">
             <span className={`text-[15px] font-bold ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`}>{msg.text || (msg.sender === 'me' ? 'You video called' : 'Missed Video Call')}</span>
           </div>
        </div>
      );
    case 'deleted':
      return (
        <div className="flex items-center gap-1 opacity-70 italic text-sm text-gray-500">
           <FaSnapchatGhost className="w-4 h-4" />
           <span>Deleted Chat</span>
        </div>
      );
    default:
      return <span className={`text-[1em] font-medium tracking-tight break-words ${isMe ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white' : 'text-black')}`}>{msg.text}</span>;
  }
};

const SnapchatPreview = ({ data }: { data: MessageData }) => {
  const isDark = data.theme === 'dark';
  
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  // Snapchat uses vertical lines to separate messages by sender.
  // We'll process messages to group them.

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-[#000000] text-white' : 'bg-white text-black'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-3 pb-2 pt-9 border-b ${isDark ? 'border-gray-800 bg-[#000000]' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center pl-1 pr-2 cursor-pointer">
             <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 ${data.isBitmoji ? '' : 'rounded-full overflow-hidden'} flex items-center justify-center relative`}>
               <img src={data.profilePic} className={`w-full h-full ${data.isBitmoji ? 'object-contain scale-110 drop-shadow-sm' : 'object-cover'}`} alt="avatar" />
               {data.isOnline && (
                 <div className="absolute -bottom-0 -right-0 bg-green-500 w-3 h-3 rounded-full border-[2px] border-white dark:border-black z-10"></div>
               )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-[18px] leading-tight flex items-center gap-1">{data.senderName}</span>
              <span className={`text-[12px] font-medium flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><FaSnapchatGhost className="w-[10px] h-[10px]"/> {data.username || '12,345'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2 opacity-80">
           <Video className="w-[22px] h-[22px]" strokeWidth={2} />
           <Phone className="w=[20px] h-[20px]" strokeWidth={2} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col bg-opacity-40">
        
        <div className="flex flex-col items-center justify-center mb-8 mt-4 space-y-3">
           <div className={`w-20 h-20 ${data.isBitmoji ? '' : 'bg-yellow-100 rounded-full p-1.5 shadow-sm'} flex items-center justify-center`}>
             <img src={data.profilePic} className={`w-full h-full ${data.isBitmoji ? 'object-contain scale-125 drop-shadow-md' : 'object-cover rounded-full'}`} alt="avatar" />
           </div>
           <div className="text-center">
             <span className="font-bold text-[20px] block">{data.senderName}</span>
             <span className={`text-sm opacity-60 font-semibold block ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{data.username || 'snapuser_123'}</span>
           </div>
           {data.chatDate && (
             <div className="bg-gray-200 dark:bg-gray-800 rounded-full px-3 py-1 font-bold text-[11px] text-gray-500 uppercase tracking-widest mt-2 shadow-sm">
               {data.chatDate}
             </div>
           )}
        </div>

        <div className="flex flex-col w-full pb-2 relative">
          {data.chatMessages.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            
            // Check if previous message was same sender 
            const prevMsg = idx > 0 ? data.chatMessages[idx-1] : null;
            const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender || prevMsg.dateMarker || (msg.dateMarker != null);

            // Check if next is same sender
            const nextMsg = idx < data.chatMessages.length - 1 ? data.chatMessages[idx+1] : null;
            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender || nextMsg.dateMarker || (msg.dateMarker != null);

            return (
              <div key={msg.id} className={`w-full flex justify-center mb-[2px] relative px-2 ${isFirstInGroup ? 'mt-3' : ''} ${isMe && isLastInGroup && idx === data.chatMessages.length - 1 ? 'mb-6' : ''}`}>
                {msg.dateMarker && (
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                     <span className={`text-xs font-bold uppercase tracking-widest opacity-50`}>{msg.dateMarker}</span>
                   </div>
                )}
                
                <div className={`w-full flex ${isMe ? 'border-l-[3px] border-[#00b6ff]' : 'border-l-[3px] border-[#e92754]'} pl-3 py-[3px]`}>
                   
                   <div className="flex-1 flex flex-col pr-4">
                      {isFirstInGroup && (
                        <div className={`text-[11px] font-bold tracking-wider mb-0.5 uppercase ${isMe ? 'text-[#00b6ff]' : 'text-[#e92754]'}`}>
                           {isMe ? 'Me' : data.senderName}
                        </div>
                      )}
                      
                      {msg.isForwarded && (
                        <div className="flex items-center gap-1 opacity-50 text-[11px] font-bold uppercase tracking-wide mb-0.5">
                           <SendHorizontal className="w-3 h-3" />
                           <span>Forwarded</span>
                        </div>
                      )}

                      {msg.replyToText && (
                        <div className={`p-1.5 pl-2 border-l-2 my-1 bg-black/5 dark:bg-white/10 rounded-r text-sm truncate font-semibold opacity-80 ${isMe ? 'border-[#e92754]' : 'border-[#00b6ff]'}`}>
                           {msg.replyToText}
                        </div>
                      )}
                      
                      <div className="flex items-start">
                         {renderMessageContent(msg, isDark, isMe)}
                      </div>
                      
                      {msg.reaction && (
                        <div className="flex mt-1">
                           <div className={`text-[12px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} shadow-sm`}>{msg.reaction}</div>
                        </div>
                      )}
                      
                   </div>
                </div>
                
                {isLastInGroup && idx === data.chatMessages.length - 1 && isMe && (
                  <div className={`absolute -bottom-[18px] left-4 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {msg.status === 'read' ? 'Opened' : msg.status === 'delivered' ? 'Delivered' : 'Sent'} • Just now
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bitmoji Peeking Status indicator */}
        {(data.isBitmoji && data.statusText) || data.isTyping ? (
          <div className="sticky bottom-0 left-2 w-full flex items-end mt-auto h-0 overflow-visible z-10 pointer-events-none">
             <div className="relative transform translate-y-3 flex items-end gap-2 text-black">
                <div className="w-16 h-16 relative">
                  <img src={data.profilePic} className="w-full h-full object-contain drop-shadow-md" alt="bitmoji peek" />
                </div>
                {data.isTyping && (
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold mb-4 shadow-md flex gap-1 items-center ${isDark ? 'bg-[#262626] text-white' : 'bg-white text-black'}`}>
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </div>
                )}
             </div>
          </div>
        ) : null}
      </div>

      {/* Input Area */}
      <div className={`px-2 py-2 mt-auto border-t pb-[env(safe-area-inset-bottom,20px)] ${isDark ? 'border-gray-800 bg-[#000000]' : 'border-gray-200 bg-white'}`}>
         <div className={`flex items-end w-full rounded-3xl px-1 py-1 ${isDark ? 'bg-[#191919]' : 'bg-[#f0f0f0]'}`}>
            <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-white shadow-sm'} mr-2 mb-1`}>
               <Camera className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} strokeWidth={2.5}/>
            </div>
            
            <div ref={textInputRef} className={`flex-1 font-bold text-[15px] pt-[10px] pb-[10px] max-h-[108px] overflow-y-auto break-words whitespace-pre-wrap ${typeof data.replayTypingText === 'string' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'opacity-60 text-gray-300' : 'opacity-60 text-gray-600')}`}>
               {typeof data.replayTypingText === 'string' ? data.replayTypingText : 'Send a chat'}
            </div>
            
            <div className="flex items-center gap-1 pr-1 mb-1">
               {typeof data.replayTypingText === 'string' ? (
                  <div className="p-2">
                     <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#000000]' : 'bg-white'}`}>
                       <svg viewBox="0 0 24 24" width="20" height="20" className="fill-none stroke-current" strokeWidth={2.5}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                     </div>
                  </div>
               ) : (
                 <>
                   <div className="p-2 opacity-80">
                     <Mic className="w-5 h-5" strokeWidth={2.5}/>
                   </div>
                   <div className="p-2 opacity-80">
                     <ImageIcon className="w-5 h-5" strokeWidth={2.5}/>
                   </div>
                   <div className="p-2 opacity-80">
                     <Smile className="w-5 h-5" strokeWidth={2.5}/>
                   </div>
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

export default SnapchatPreview;
