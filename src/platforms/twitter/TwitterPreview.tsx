import { MessageData } from "../../types";
import { formatNumber } from "../../components/utils";

export default function TwitterPreview({ data }: { data: MessageData }) {
  const isDark = data.theme === 'dark';

  return (
    <div className={`flex flex-col min-h-full ${isDark ? 'bg-black text-[#e7e9ea]' : 'bg-white text-[#0f1419]'}`}>
      
      {/* Top Header */}
      <div className={`flex items-center px-4 pb-2 pt-8 sticky top-0 z-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="p-2 rounded-full cursor-pointer transition-colors mr-6" style={{ background: isDark ? 'rgba(239, 243, 244, 0.1)' : 'rgba(15, 20, 25, 0.1)' }}>
           <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-5 h-5 opacity-90 ${isDark ? 'fill-white' : 'fill-black'}`}><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
        </div>
        <h2 className="text-[20px] font-bold font-sans">Post</h2>
      </div>

      <div className="px-4 py-2">
        {/* User Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={data.profilePic} alt={data.senderName} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1 hover:underline cursor-pointer">
                <span className={`font-bold text-[15px] ${isDark ? 'text-white' : 'text-[#0f1419]'}`}>{data.senderName}</span>
                {data.isVerified && (
                    <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-[18px] h-[18px] text-[#1d9bf0] fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.728 2.76 1.83 3.495-.125.485-.192.996-.192 1.505 0 2.21 1.71 4 3.918 4 .58 0 1.14-.14 1.636-.395 1.01 1.08 2.43 1.75 3.998 1.75s2.99-.67 4-1.75c.496.255 1.056.395 1.636.395 2.21 0 3.918-1.79 3.918-4 0-.51-.067-1.02-.192-1.505 1.103-.735 1.83-2.035 1.83-3.495zm-11.49 3.49l-3-3 1.5-1.5 1.5 1.5 4.5-4.5 1.5 1.5-6 6z"></path></g></svg>
                )}
              </div>
              <span className={`text-[15px] leading-tight ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>{data.username?.startsWith('@') ? data.username : `@${data.username || 'username'}`}</span>
            </div>
          </div>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-5 h-5 ${isDark ? 'fill-[#71767b]' : 'fill-[#536471]'}`}><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
        </div>

        {/* Tweet Content */}
        <div className="mt-4 mb-3">
          <p className={`text-[17px] leading-[24px] whitespace-pre-wrap break-words ${isDark ? 'text-[#e7e9ea]' : 'text-[#0f1419]'}`}>{data.message}</p>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-1 py-4 border-b text-[15px] ${isDark ? 'text-[#71767b] border-[#2f3336]' : 'text-[#536471] border-[#eff3f4]'} `}>
          <span>{data.time || '7:00 PM'}</span>
          <span>·</span>
          <span>{data.chatDate || 'Dec 21, 2023'}</span>
          <span>·</span>
          <span><span className={isDark ? 'text-white font-bold' : 'text-[#0f1419] font-bold'}>{formatNumber(data.likesCount ? data.likesCount * 3 : 0)}</span> Views</span>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center justify-between py-3 text-[15px] ${isDark ? 'text-[#71767b]' : 'text-[#536471]'} border-b ${isDark ? 'border-[#2f3336]' : 'border-[#eff3f4]'} font-medium`}>
          <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer group">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
            <span className="text-[13px]">{data.chatMessages.length || 12}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-[#00ba7c] cursor-pointer group">
             <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
            <span className="text-[13px]">{formatNumber(data.retweetsCount || 0)}</span>
          </div>
          <div onClick={() => window.confirm('Are you sure you want to share this?')} className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer group">
             <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
             <span className="text-[13px]">Share</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-[#f91880] cursor-pointer group text-[#f91880]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
            <span className="text-[13px]">{formatNumber(data.likesCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer group">
             <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
             <span className="text-[13px]">{formatNumber(Math.floor((data.likesCount || 0) * 0.1))}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer group">
             <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[20px] h-[20px] fill-current opacity-80"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col pb-20">
        <div className={`px-4 py-3 font-bold text-[15px] border-b ${isDark ? 'text-[#e7e9ea] border-[#2f3336]' : 'text-[#0f1419] border-[#eff3f4]'}`}>
          Most relevant replies
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-[18px] h-[18px] inline-block ml-1 align-text-bottom ${isDark ? 'fill-[#e7e9ea]' : 'fill-[#0f1419]'}`}><g><path d="M3.543 8.96l8.457 8.45 8.457-8.45-1.414-1.42L12 14.58 4.957 7.54 3.543 8.96z"></path></g></svg>
        </div>
        {data.chatMessages.map((msg, index) => {
           const isMe = msg.sender === 'me';
           
           // Generate deterministic mock users based on index for variety
           const mockUsers = [
             { name: 'Anglina Revira', username: '@Anglina_2210', pic: 'https://i.pravatar.cc/150?u=11' },
             { name: 'Daisy', username: '@Daisy_660', pic: 'https://i.pravatar.cc/150?u=22' },
             { name: 'Anna', username: '@Anna_xb2', pic: 'https://i.pravatar.cc/150?u=33' },
             { name: 'Ruby', username: '@Ruby__8090', pic: 'https://i.pravatar.cc/150?u=44' },
             { name: 'Alex', username: '@alex_dev', pic: 'https://i.pravatar.cc/150?u=55' },
             { name: 'Sarah', username: '@sarah_smith', pic: 'https://i.pravatar.cc/150?u=66' }
           ];
           const mockUser = mockUsers[Math.floor(index / 2) % mockUsers.length];

           const pic = isMe ? (msg.replyProfilePic || mockUser.pic) : data.profilePic;
           const name = isMe ? (msg.replyName || mockUser.name) : data.senderName;
           let baseUsername = mockUser.username;
           if (msg.replyUsername) {
             baseUsername = msg.replyUsername.startsWith('@') ? msg.replyUsername : `@${msg.replyUsername}`;
           }
           let username = isMe ? baseUsername : (data.username?.startsWith('@') ? data.username : `@${data.username}`);
           if (!username || username === '@undefined') username = isMe ? baseUsername : '@user';

           const isThreadStart = index % 2 === 0;
           const hasThreadReply = isThreadStart && index + 1 < data.chatMessages.length;
           
           let replyingTo = '';
           if (isThreadStart) {
             replyingTo = data.username?.startsWith('@') ? data.username : `@${data.username || 'username'}`;
           }

           return (
             <div key={msg.id} className={`flex gap-3 px-4 pt-3 ${hasThreadReply ? '' : (isDark ? 'border-b border-[#2f3336]' : 'border-b border-[#eff3f4]')} ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.03]'} cursor-pointer relative`}>
               <div className="flex flex-col items-center shrink-0 w-10 relative">
                 <img src={pic} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0 z-10" />
                 {hasThreadReply && (
                   <div className={`absolute top-[44px] bottom-[-8px] w-0.5 ${isDark ? 'bg-[#333639]' : 'bg-[#cfd9de]'}`}></div>
                 )}
               </div>
               
               <div className={`flex flex-col flex-1 pb-3 min-w-0`}>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1 text-[15px] min-w-0">
                     <span className={`font-bold hover:underline truncate ${isDark ? 'text-white' : 'text-[#0f1419]'}`}>{name}</span>
                     {!isMe && data.isVerified && (
                        <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-[16px] h-[16px] text-[#1d9bf0] fill-current shrink-0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.728 2.76 1.83 3.495-.125.485-.192.996-.192 1.505 0 2.21 1.71 4 3.918 4 .58 0 1.14-.14 1.636-.395 1.01 1.08 2.43 1.75 3.998 1.75s2.99-.67 4-1.75c.496.255 1.056.395 1.636.395 2.21 0 3.918-1.79 3.918-4 0-.51-.067-1.02-.192-1.505 1.103-.735 1.83-2.035 1.83-3.495zm-11.49 3.49l-3-3 1.5-1.5 1.5 1.5 4.5-4.5 1.5 1.5-6 6z"></path></g></svg>
                     )}
                     <span className={`truncate shrink ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>{username}</span>
                     <span className={`shrink-0 ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>·</span>
                     <span className={`hover:underline shrink-0 ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>{msg.time || '10h'}</span>
                   </div>
                   <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-4 h-4 shrink-0 px-2 ${isDark ? 'fill-[#71767b]' : 'fill-[#536471]'}`}><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                 </div>
                 
                 {replyingTo && (
                   <div className={`text-[15px] -mt-1.5 mb-1 ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>
                     Replying to <span className="text-[#1d9bf0] hover:underline cursor-pointer">{replyingTo}</span>
                     {msg.sender === 'me' && <span className="text-[#1d9bf0] hover:underline cursor-pointer"> and @others</span>}
                   </div>
                 )}
                 
                 <div className="mt-0.5 mb-2">
                   <p className={`text-[15px] leading-[20px] whitespace-pre-wrap break-words ${isDark ? 'text-[#e7e9ea]' : 'text-[#0f1419]'}`}>{msg.text}</p>
                 </div>
                 
                 <div className={`flex items-center justify-between text-[13px] ${isDark ? 'text-[#71767b]' : 'text-[#536471]'} font-medium pr-12 max-w-md`}>
                    <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer group">
                      <div className={`p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current opacity-80 group-hover:opacity-100"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                      </div>
                      <span className="text-[13px]">{index === 1 ? '1' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#00ba7c] cursor-pointer group">
                       <div className={`p-1.5 rounded-full group-hover:bg-[#00ba7c]/10`}>
                         <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current opacity-80 group-hover:opacity-100"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                       </div>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#f91880] cursor-pointer group">
                      <div className={`p-1.5 rounded-full group-hover:bg-[#f91880]/10`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current opacity-80 group-hover:opacity-100"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                      </div>
                      <span className="text-[13px]">{msg.reaction ? '1' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer group">
                       <div className={`p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10`}>
                         <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current opacity-80 group-hover:opacity-100"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
                       </div>
                       <span className="text-[13px]">{58 + (index * 2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer group">
                       <div className={`p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10`}>
                         <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current opacity-80 group-hover:opacity-100"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
                       </div>
                    </div>
                 </div>
               </div>
             </div>
           )
        })}
      </div>

      {/* Add Reply Area (Sticky Bottom) */}
      <div className={`sticky bottom-0 z-10 w-full px-4 py-3 flex items-center justify-between mt-auto gap-3 text-[15px] border-t ${isDark ? 'border-[#2f3336] bg-black' : 'border-[#eff3f4] bg-white'}`}>
        <div className={`text-[15px] ${isDark ? 'text-[#71767b]' : 'text-[#536471]'}`}>Post your reply</div>
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-[22px] h-[22px] fill-current ${isDark ? 'text-[#1d9bf0]' : 'text-[#1d9bf0]'}`}><g><path d="M19.75 22H4.25C3.01 22 2 20.99 2 19.75V8.25C2 7.01 3.01 6 4.25 6h1.53c.48-1.52 1.9-2.5 3.52-2.5h5.4c1.62 0 3.04.98 3.52 2.5h1.53c1.24 0 2.25 1.01 2.25 2.25v11.5c0 1.24-1.01 2.25-2.25 2.25zm-15.5-14c-.14 0-.25.11-.25.25v11.5c0 .14.11.25.25.25h15.5c.14 0 .25-.11.25-.25V8.25c0-.14-.11-.25-.25-.25h-2.28l-.34-1.1c-.2-.67-.84-1.15-1.54-1.15h-5.4c-.7 0-1.34.48-1.54 1.15l-.34 1.1H4.25zM12 18.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"></path></g></svg>
        </div>
      </div>

      
    </div>
  );
}
