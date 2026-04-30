import { MessageData } from "../../types";
import { formatNumber } from "../../components/utils";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaShare } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export default function RedditPreview({ data }: { data: MessageData }) {
  const isDark = data.theme === 'dark';

  return (
    <div className={`flex flex-col h-full font-sans overflow-y-auto ${isDark ? 'bg-black text-[#D7DADC]' : 'bg-[#DAE0E6] text-[#1A1A1B]'}`}>
      
      {/* Top App Bar */}
      <div className={`flex items-center justify-between px-4 pt-9 pb-3 sticky top-0 z-10 ${isDark ? 'bg-[#1A1A1B] border-b border-[#343536]' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className={`w-6 h-6 cursor-pointer ${isDark ? 'fill-[#D7DADC]' : 'fill-[#1A1A1B]'}`}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className={`w-5 h-5 cursor-pointer ${isDark ? 'fill-[#D7DADC]' : 'fill-[#1A1A1B]'}`}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <BiDotsHorizontalRounded className={`w-6 h-6 cursor-pointer ${isDark ? 'text-[#D7DADC]' : 'text-[#1A1A1B]'}`} />
        </div>
      </div>

      <div className={`mt-0 sm:mt-2 mx-0 sm:mx-2 mb-2 pb-2 ${isDark ? 'bg-[#1A1A1B]' : 'bg-white'} sm:rounded-md`}>
         {/* Post Header */}
         <div className="flex items-center justify-between px-3 pt-3 pb-2 text-[12px]">
            <div className="flex items-center gap-2">
               <div className="relative">
                 <img src={data.profilePic} alt="subreddit" className="w-8 h-8 rounded-full object-cover" />
               </div>
               <div className="flex flex-col">
                  <span className={`font-bold hover:underline cursor-pointer ${isDark ? 'text-[#D7DADC]' : 'text-[#1C1C1C]'}`}>r/{data.senderName.toLowerCase().replace(/\s/g, '')}</span>
                  <div className={`flex items-center gap-1 ${isDark ? 'text-[#818384]' : 'text-[#787C7E]'}`}>
                    <span className="hover:underline cursor-pointer">u/{data.username ? data.username.replace('@', '') : 'user'}</span>
                    <span>•</span>
                    <span>{data.timestamp || '2h'}</span>
                  </div>
               </div>
            </div>
            <button className={`font-bold rounded-full px-4 py-1.5 transition-colors ${isDark ? 'bg-[#D7DADC] text-[#1A1A1B] hover:bg-white' : 'bg-[#0079D3] text-white hover:bg-[#1484D6]'}`}>
               Join
            </button>
         </div>

         {/* Post Title & Content */}
         <div className="px-4 pb-2">
            <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-[#D7DADC]' : 'text-[#222222]'}`}>{data.statusText || 'Discussion Thread'}</h2>
            <p className={`text-[14px] leading-relaxed whitespace-pre-wrap ${isDark ? 'text-[#D7DADC]' : 'text-[#1C1C1C]'}`}>
              {data.message || 'What are your thoughts on this?'}
            </p>
         </div>

         {/* Post Actions */}
         <div className={`flex items-center gap-1 px-2 py-2 mt-2 ${isDark ? 'text-[#818384]' : 'text-[#878A8C]'}`}>
            <div className={`flex items-center border rounded-full px-1 ${isDark ? 'border-[#343536]' : 'border-gray-200'} h-9`}>
               <div className={`p-1.5 rounded hover:bg-gray-200/20 cursor-pointer ${isDark ? 'hover:text-[#FF4500]' : 'hover:text-[#CC3700]'}`}>
                 <FaArrowUp className="w-4 h-4" />
               </div>
               <span className="font-bold text-sm px-1.5">{formatNumber(data.likesCount || 1240)}</span>
               <div className={`p-1.5 rounded hover:bg-gray-200/20 cursor-pointer ${isDark ? 'hover:text-[#7193FF]' : 'hover:text-[#5A76CC]'}`}>
                 <FaArrowDown className="w-4 h-4" />
               </div>
            </div>
            <div className={`flex items-center gap-1.5 border rounded-full px-3 h-9 cursor-pointer hover:bg-gray-200/20 ${isDark ? 'border-[#343536]' : 'border-gray-200'}`}>
               <FaCommentAlt className="w-4 h-4" />
               <span className="font-bold text-xs">{data.chatMessages.length}</span>
            </div>
            <div className={`flex items-center gap-1.5 border rounded-full px-3 h-9 cursor-pointer hover:bg-gray-200/20 ${isDark ? 'border-[#343536]' : 'border-gray-200'}`}>
               <FaShare className="w-4 h-4" />
               <span className="font-bold text-xs">Share</span>
            </div>
         </div>
      </div>

      {/* Comments Section */}
      <div className={`flex-1 ${isDark ? 'bg-[#1A1A1B]' : 'bg-white'}`}>
        <div className={`px-4 py-3 border-b text-sm font-semibold flex items-center justify-between ${isDark ? 'border-[#343536] text-[#D7DADC]' : 'border-gray-200 text-[#1A1A1B]'}`}>
          <span>Relevant Comments</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z"></path></svg>
        </div>
        
        {data.chatMessages.map((msg, index) => {
           const isMe = msg.sender === 'me';
           
           return (
             <div key={msg.id} className={`flex flex-col px-4 pt-3 pb-1 border-b ${isDark ? 'border-[#343536]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                   <img src={isMe ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' : data.profilePic} alt="avatar" className="w-6 h-6 rounded-full" />
                   <span className={`text-xs font-bold ${isDark ? 'text-[#D7DADC]' : 'text-[#1C1C1C]'}`}>{isMe ? 'u/you' : `u/${data.username?.replace('@', '') || 'user'}`}</span>
                   {isMe && <span className="text-[10px] font-bold text-[#0079D3] bg-[#0079D3]/10 px-1 rounded">OP</span>}
                   <span className={`text-[11px] ${isDark ? 'text-[#818384]' : 'text-[#787C7E]'}`}>• {msg.time || '1h'}</span>
                </div>
                <div className={`pl-8 text-sm ${isDark ? 'text-[#D7DADC]' : 'text-[#1C1C1C]'}`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-4 pl-8 mt-2 ${isDark ? 'text-[#818384]' : 'text-[#878A8C]'}`}>
                   <div className="flex items-center gap-1.5">
                     <FaArrowUp className={`w-3.5 h-3.5 cursor-pointer ${isDark ? 'hover:text-[#FF4500]' : 'hover:text-[#CC3700]'}`} />
                     <span className="font-bold text-xs">{msg.reaction ? msg.reaction : '2'}</span>
                     <FaArrowDown className={`w-3.5 h-3.5 cursor-pointer ${isDark ? 'hover:text-[#7193FF]' : 'hover:text-[#5A76CC]'}`} />
                   </div>
                   <div className="flex items-center gap-1.5 cursor-pointer hover:underline text-xs font-bold cursor-pointer">
                     <FaCommentAlt className="w-3 h-3" />
                     <span>Reply</span>
                   </div>
                </div>
             </div>
           );
        })}
      </div>

    </div>
  );
}
