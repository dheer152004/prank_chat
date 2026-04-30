import { MessageData } from "../../types";
import { formatNumber } from "../../components/utils";
import { FaPhoneAlt, FaVideo, FaInfoCircle } from "react-icons/fa";

export default function FacebookPreview({ data }: { data: MessageData }) {
  const isDark = data.theme === 'dark';

  return (
    <div className={`flex flex-col h-full font-sans ${isDark ? 'bg-black text-[#E4E6EB]' : 'bg-white text-black'}`}>
      
      {/* Messenger Header */}
      <div className={`flex items-center justify-between px-4 pt-9 pb-3 border-b sticky top-0 z-10 ${isDark ? 'bg-black border-[#242526]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500 cursor-pointer">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
          <div className="relative">
             <img src={data.profilePic} alt={data.senderName} className="w-9 h-9 rounded-full object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full border-white"></div>
          </div>
          <div className="flex flex-col leading-tight cursor-pointer">
            <span className="font-semibold text-[16px]">{data.senderName}</span>
            <span className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active now</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-blue-500 cursor-pointer">
          <FaPhoneAlt className="w-[18px] h-[18px]" />
          <FaVideo className="w-[20px] h-[20px]" />
          <FaInfoCircle className="w-[20px] h-[20px]" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
         {/* Profile summary at top of chat */}
         <div className="flex flex-col items-center justify-center my-6">
            <img src={data.profilePic} alt={data.senderName} className="w-20 h-20 rounded-full object-cover mb-2" />
            <span className="font-bold text-xl">{data.senderName}</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Facebook</span>
            <span className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You're friends on Facebook</span>
         </div>
         
         <div className={`text-center text-xs my-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {data.chatDate || 'Dec 21, 2023 at 3:00 PM'}
         </div>

         {data.chatMessages.map((msg, index) => {
           const isMe = msg.sender === 'me';
           const showProfile = !isMe && (index === data.chatMessages.length - 1 || data.chatMessages[index + 1]?.sender === 'me');

           return (
             <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
               {!isMe && (
                 <div className="w-7 h-7 flex-shrink-0">
                   {showProfile && <img src={data.profilePic} alt="" className="w-full h-full rounded-full object-cover" />}
                 </div>
               )}
               <div className={`relative max-w-[70%] ${msg.reaction ? 'mb-4' : ''}`}>
                 <div className={`px-3.5 py-2 text-[15px] leading-[1.35] ${isMe ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm' : `${isDark ? 'bg-[#3E4042] text-[#E4E6EB]' : 'bg-[#E4E6EB] text-black'} rounded-2xl rounded-bl-sm`}`}>
                    {msg.text}
                 </div>
                 {msg.reaction && (
                    <div className={`absolute -bottom-3 -right-2 ${isDark ? 'bg-black' : 'bg-white'} rounded-full p-[2px] shadow-sm z-10 text-sm`}>
                       <div className={`${isDark ? 'bg-[#3E4042]' : 'bg-[#F0F2F5]'} rounded-full px-1.5 py-0.5`}>
                         {msg.reaction}
                       </div>
                    </div>
                 )}
               </div>
             </div>
           );
         })}
         {data.isTyping && (
           <div className={`flex items-end gap-2 justify-start`}>
             <div className="w-7 h-7 flex-shrink-0">
               <img src={data.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
             </div>
             <div className={`relative max-w-[70%]`}>
               <div className={`px-4 py-2.5 text-[15px] leading-[1.35] ${isDark ? 'bg-[#3E4042]' : 'bg-[#E4E6EB]'} rounded-2xl rounded-bl-sm flex items-center justify-center gap-1.5 h-9`}>
                 <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
                 <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
                 <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
               </div>
             </div>
           </div>
         )}
      </div>

      {/* Input Area */}
      <div className={`flex items-end gap-2 px-3 py-3 border-t ${isDark ? 'border-[#242526]' : 'border-gray-200'}`}>
        <div className="flex gap-3 text-blue-500 pb-2">
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current cursor-pointer"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current cursor-pointer"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current cursor-pointer"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"></path></svg>
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current cursor-pointer"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H7.89c.8 2.04 2.78 3.5 5.11 3.5z"></path></svg>
        </div>
        <div className={`flex-1 rounded-full px-4 py-2 flex items-center gap-2 ${isDark ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
           <input type="text" placeholder="Message" className="bg-transparent outline-none flex-1 text-[15px]" disabled />
           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500 cursor-pointer"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"></path></svg>
        </div>
        <div className="pl-1 pb-1">
           <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-500 cursor-pointer"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>
        </div>
      </div>

    </div>
  );
}
