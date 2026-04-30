import React, { useEffect, useRef } from "react";
import { MessageData, ChatMessage } from "../../types";
import { Menu, Plus, Mic, SquarePen, MoreVertical, Copy, ThumbsUp, ThumbsDown, Volume2, RefreshCcw, Share2, ArrowUp } from 'lucide-react';
import Keyboard from '../../components/Keyboard';

export default function ChatGPTPreview({ data }: { data: MessageData }) {
  const isDark = data.theme === 'dark';
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && typeof data.replayTypingText === 'string') {
      textInputRef.current.scrollTop = textInputRef.current.scrollHeight;
    }
  }, [data.replayTypingText]);

  const renderMessageContent = (msg: ChatMessage, isMe: boolean) => {
    return (
      <div className="flex flex-col gap-2">
        {msg.attachmentUrl && (
          <img 
            src={msg.attachmentUrl} 
            alt="attachment" 
            className="max-w-full rounded-2xl max-h-[300px] object-cover"
          />
        )}
        {msg.text && (
          <div className="whitespace-pre-wrap break-words">
            {msg.text}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full font-sans ${isDark ? 'bg-[#000000] text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 pt-10 pb-3`}>
        {/* Menu button */}
        <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#212121]' : 'bg-gray-100'}`}>
          <Menu className={`w-[22px] h-[22px] ${isDark ? 'text-white' : 'text-black'}`} />
        </div>

        {/* Right Pill */}
        <div className={`h-[42px] rounded-full flex items-center px-4 gap-5 ${isDark ? 'bg-[#212121]' : 'bg-gray-100'}`}>
          <SquarePen className={`w-[20px] h-[20px] ${isDark ? 'text-white' : 'text-black'}`} />
          <MoreVertical className={`w-[20px] h-[20px] ${isDark ? 'text-white' : 'text-black'}`} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto w-full no-scrollbar px-4 pt-6 pb-2">
        <div className="flex flex-col max-w-2xl mx-auto">
          {data.chatMessages.map((msg) => {
            const isMe = msg.sender === 'me';

            if (isMe) {
              return (
                <div key={msg.id} className="flex flex-col items-end w-full mb-8">
                  <div className={`max-w-[85%] px-[18px] py-[12px] rounded-3xl text-[16px] leading-[24px] ${isDark ? 'bg-[#2f2f2f]' : 'bg-[#f4f4f4]'}`}>
                    {renderMessageContent(msg, true)}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={msg.id} className="flex flex-col w-full mb-8">
                  <div className={`text-[16px] leading-[24px] ${isDark ? 'text-white' : 'text-black'}`}>
                    {renderMessageContent(msg, false)}
                  </div>

                  {/* Bot Actions */}
                  <div className={`flex items-center gap-5 mt-4 ${isDark ? 'text-[#a1a1aa]' : 'text-gray-500'}`}>
                    <Copy className="w-[16px] h-[16px] cursor-pointer" />
                    <ThumbsUp className="w-[16px] h-[16px] cursor-pointer" />
                    <ThumbsDown className="w-[16px] h-[16px] cursor-pointer" />
                    <Volume2 className="w-[16px] h-[16px] cursor-pointer" />
                    <RefreshCcw className="w-[16px] h-[16px] cursor-pointer" />
                    <Share2 className="w-[16px] h-[16px] cursor-pointer" />
                  </div>
                </div>
              );
            }
          })}
          
          {/* Typing Indicator */}
          {data.isTyping && (
             <div className="flex w-full mb-8">
                <div className={`w-3 h-3 rounded-full mt-2 animate-pulse ${isDark ? 'bg-white' : 'bg-black'}`} />
             </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`px-4 pt-2 pb-[env(safe-area-inset-bottom,20px)] mt-auto z-10 ${isDark ? 'bg-[#000000]' : 'bg-white'}`}>
         <div className="flex items-end gap-2 mb-2 max-w-2xl mx-auto">
            {/* Plus Button */}
            <div className={`flex-shrink-0 w-[42px] h-[42px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#212121]' : 'bg-gray-100'}`}>
              <Plus className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
            </div>

            {/* Input Box */}
            <div className={`flex-1 flex items-end min-w-0 rounded-[24px] px-1 py-1 ${isDark ? 'bg-[#212121]' : 'bg-gray-100'}`}>
               <div 
                 ref={textInputRef} 
                 className={`flex-1 overflow-y-auto px-3 py-[9px] text-[16px] leading-[22px] max-h-[120px] whitespace-pre-wrap break-words ${isDark ? 'text-white' : 'text-black'}`}
               >
                 {typeof data.replayTypingText === 'string' ? data.replayTypingText : <span className={`text-[16px] ${isDark ? 'text-[#a1a1aa]' : 'text-gray-500'}`}>Ask ChatGPT</span>}
               </div>
               
               {/* Right icons in Input Box */}
               <div className="flex items-center gap-1 pb-0.5 pr-0.5 flex-shrink-0">
                  {typeof data.replayTypingText === 'string' ? (
                    <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center ${isDark ? 'bg-white' : 'bg-black'}`}>
                      <ArrowUp className={`w-[18px] h-[18px] stroke-[2.5px] ${isDark ? 'text-black' : 'text-white'}`} />
                    </div>
                  ) : (
                    <>
                      <Mic className={`w-[22px] h-[22px] mx-1.5 ${isDark ? 'text-[#a1a1aa]' : 'text-gray-500'}`} />
                      <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center ${isDark ? 'bg-white' : 'bg-black'}`}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill={isDark ? "black" : "white"}>
                          <rect x="5" y="9" width="1.5" height="6" rx="0.75"/>
                          <rect x="9" y="5" width="1.5" height="14" rx="0.75"/>
                          <rect x="13" y="8" width="1.5" height="8" rx="0.75"/>
                          <rect x="17" y="10" width="1.5" height="4" rx="0.75"/>
                        </svg>
                      </div>
                    </>
                  )}
               </div>
            </div>
         </div>
      </div>
      
      {typeof data.replayTypingText === 'string' && (
         <Keyboard activeKey={data.typingKey} isDark={isDark} />
      )}
    </div>
  );
}
