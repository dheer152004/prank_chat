import React, { useEffect, useRef } from "react";
import { MessageData } from "../../types";
import { FaShieldAlt, FaVideo, FaShieldVirus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Keyboard from '../../components/Keyboard';

export default function TinderPreview({ data }: { data: MessageData }) {
  const isDark = data.theme === 'dark';
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  return (
    <div className={`flex flex-col h-full font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-3 pt-9 pb-3 border-b shadow-sm sticky top-0 z-10 ${isDark ? 'bg-[#111418] border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-2">
           <IoIosArrowBack className={`w-7 h-7 cursor-pointer ${isDark ? 'text-rose-500' : 'text-rose-500'}`} />
           <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                 <img src={data.profilePic} alt={data.senderName} className="w-10 h-10 rounded-full object-cover" />
                 {data.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                       <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                    </div>
                 )}
              </div>
              <span className="font-bold text-xl">{data.senderName}</span>
           </div>
        </div>
        <div className={`flex items-center gap-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
           <FaVideo className="w-6 h-6 cursor-pointer" />
           <FaShieldVirus className="w-5 h-5 cursor-pointer text-blue-500" />
        </div>
      </div>

      {/* Match Text & Chat Area or Unmatched State */}
      {data.isUnmatched ? (
         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-80 gap-3">
           <div className={`w-28 h-28 rounded-full border-4 border-dashed mb-2 flex items-center justify-center ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <FaShieldVirus className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
           </div>
           <h2 className="text-xl font-bold">You Unmatched {data.senderName}</h2>
           <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This user will no longer appear in your match list.</p>
         </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center my-6 gap-1">
             <span className={`text-sm tracking-widest font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>MATCHED WITH {data.senderName.toUpperCase()}</span>
             <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{data.chatDate || 'Dec 21, 2023'}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
             {data.chatMessages.map((msg, index) => {
               const isMe = msg.sender === 'me';
               const showProfile = !isMe && (index === data.chatMessages.length - 1 || data.chatMessages[index + 1]?.sender === 'me');

               return (
                 <div key={msg.id} className={`flex items-end gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                   {!isMe && (
                     <div className="w-8 h-8 flex-shrink-0">
                       {showProfile && <img src={data.profilePic} alt="" className="w-full h-full rounded-full object-cover" />}
                     </div>
                   )}
                   <div className={`relative max-w-[75%]`}>
                     <div 
                       className={`px-4 py-2.5 text-[15px] leading-tight ${isMe ? 'bg-gradient-to-r from-rose-500 to-rose-400 text-white rounded-2xl rounded-br-sm' : `${isDark ? 'bg-[#2A2E33] text-white' : 'bg-[#E8EBED] text-black'} rounded-2xl rounded-bl-sm`}`}
                     >
                        {msg.text}
                     </div>
                     {msg.reaction && (
                       <div className="absolute -bottom-2 -right-2 text-2xl">
                         {msg.reaction}
                       </div>
                     )}
                   </div>
                   {isMe && msg.status === 'read' && index === data.chatMessages.length - 1 && (
                      <div className="w-full text-right text-xs text-rose-500 font-medium mt-1">Read</div>
                   )}
                 </div>
               );
             })}
             
             {data.isTyping && (
                <div className={`flex items-end gap-2 mb-1 justify-start`}>
                   <div className="w-8 h-8 flex-shrink-0">
                      <img src={data.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
                   </div>
                   <div className={`relative max-w-[75%]`}>
                     <div className={`px-4 py-[14px] text-[15px] leading-tight ${isDark ? 'bg-[#2A2E33] text-white' : 'bg-[#E8EBED] text-black'} rounded-2xl rounded-bl-sm flex items-center justify-center gap-1.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
                     </div>
                   </div>
                 </div>
             )}
          </div>

          <div className={`px-4 py-3 pb-[env(safe-area-inset-bottom,20px)] mt-auto z-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
            <div className={`flex items-end gap-3 rounded-[24px] px-4 py-2 border ${isDark ? 'border-gray-800 bg-[#111418]' : 'border-gray-300'}`}>
               <div ref={textInputRef} className={`flex-1 min-w-0 max-h-[108px] overflow-y-auto text-[15px] leading-[22px] py-0.5 ${(isDark || data.replayTypingText) ? 'text-white' : 'text-black'} break-words whitespace-pre-wrap`}>
                 {typeof data.replayTypingText === 'string' ? data.replayTypingText : <span className={`text-[15px] ${isDark ? 'bg-transparent text-gray-500' : 'text-gray-400'}`}>Type a message...</span>}
               </div>
               
               {typeof data.replayTypingText === 'string' ? (
                 <span className="font-bold text-rose-500 cursor-pointer self-end mb-[2px]">SEND</span>
               ) : (
                 <span className="font-bold text-rose-500 cursor-pointer self-end mb-[2px]">GIF</span>
               )}
            </div>
          </div>
          
          {typeof data.replayTypingText === 'string' && (
             <Keyboard activeKey={data.typingKey} isDark={isDark} />
          )}
        </>
      )}

      {/* Unmatch Modal Overlay Mockup */}
      {data.showUnmatchModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className={`w-[90%] rounded-2xl flex flex-col overflow-hidden shadow-2xl ${isDark ? 'bg-[#2A2E33] text-white' : 'bg-white text-black'}`}>
             <div className="p-6 flex flex-col items-center text-center pb-4">
                <span className="font-bold text-xl mb-2">Unmatch {data.senderName}?</span>
                <span className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  You'll disappear from their match list and they will disappear from yours. This action cannot be undone.
                </span>
             </div>
             <div className={`flex flex-col border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`py-4 font-bold text-center text-rose-500 border-b cursor-pointer tracking-wide ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                   YES, UNMATCH
                </div>
                <div className={`py-4 font-bold text-center cursor-pointer opacity-70 tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                   CANCEL
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
