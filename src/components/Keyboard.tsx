import React, { useState, useEffect, useRef } from 'react';

export default function Keyboard({ activeKey, isDark }: { activeKey?: string | null, isDark?: boolean }) {
  const [page, setPage] = useState<'alpha' | 'numeric' | 'emoji'>('alpha');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = (type: 'normal' | 'modifier' | 'special' = 'normal') => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeKey) {
      if (/^[a-zA-Z]$/.test(activeKey)) {
        setPage('alpha');
      } else if (/^[0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]$/.test(activeKey)) {
        setPage('numeric');
      } else if (activeKey !== ' ') {
        setPage('emoji');
      }
    }
  }, [activeKey]);

  const alphaRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const alphaRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const alphaRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const numRow1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const numRow2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
  const numRow3 = ['.', ',', '?', '!', '\''];

  const commonEmojis = ['😂', '❤️', '😍', '😭', '😊', '🙏', '✨', '🎉', '🔥', '💯', '🥺', '🤔', '👍', '🥰', '🙌', '😘', '💀', '😆', '👀', '🙄', '😅', '💕', '👏', '😁', '🥶', '🤬', '😎'];
  
  const getMatchedKey = () => {
    if (!activeKey) return null;
    return activeKey.toLowerCase();
  };
  
  const matched = getMatchedKey();
  
  const bgMain = isDark ? '#1C1C1E' : '#D1D5DB';
  const keyBg = isDark ? '#4A4A4B' : '#FFFFFF';
  const keyActiveBg = isDark ? '#6B6B6D' : '#9CA3AF';
  const specialKeyBg = isDark ? '#2C2C2E' : '#B3B8C1';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  
  const getKeyBg = (key: string) => {
    if (key.toLowerCase() === matched) return keyActiveBg;
    return keyBg;
  };

  const renderAlphaRow3 = () => (
    <div className="flex justify-center gap-1.5 px-0.5">
      <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[42px] h-[42px] rounded-lg shadow-sm flex items-center justify-center">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 4V2L8 6l4 4V8h4c2.21 0 4 1.79 4 4s-1.79 4-4 4H8v2h8c3.31 0 6-2.69 6-6s-2.69-6-6-6h-4z"/></svg>
      </div>
      {alphaRow3.map(k => (
        <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[32px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[19px]">
          {k === matched ? activeKey : k}
        </div>
      ))}
      <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[42px] h-[42px] rounded-lg shadow-sm flex items-center justify-center">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>
      </div>
    </div>
  );

  const renderNumericRow3 = () => (
    <div className="flex justify-center gap-1.5 px-0.5">
      <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[42px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-sm">#+=</div>
      {numRow3.map(k => (
        <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[32px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[19px]">
          {k}
        </div>
      ))}
      <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[42px] h-[42px] rounded-lg shadow-sm flex items-center justify-center">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>
      </div>
    </div>
  );

  const renderEmojiGrid = () => {
    let emojis = [...commonEmojis];
    if (activeKey && activeKey !== ' ' && !emojis.includes(activeKey)) {
      emojis = [activeKey, ...emojis.slice(0, 26)];
    }
    
    return (
      <div className="flex flex-col gap-2.5 px-0.5">
        <div className="flex justify-center gap-1.5">
          {emojis.slice(0, 9).map(k => (
            <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[36px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[22px]">
              {k}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5">
          {emojis.slice(9, 18).map(k => (
            <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[36px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[22px]">
              {k}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5">
          {emojis.slice(18, 26).map(k => (
            <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[36px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[22px]">
              {k}
            </div>
          ))}
          <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[36px] h-[42px] rounded-lg shadow-sm flex items-center justify-center">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgMain, color: textColor }} className="w-full px-1.5 pb-12 pt-3 flex flex-col gap-2.5 shadow-inner z-[99]">
      
      {page === 'emoji' ? renderEmojiGrid() : (
        <>
          {/* Row 1 */}
          <div className="flex justify-center gap-1.5 px-0.5">
            {(page === 'alpha' ? alphaRow1 : numRow1).map(k => (
              <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[32px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[19px]">
                {k === matched ? activeKey : k}
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex justify-center gap-1.5 px-4">
            {(page === 'alpha' ? alphaRow2 : numRow2).map(k => (
              <div onClick={() => playClick('normal')} key={k} style={{ backgroundColor: getKeyBg(k) }} className="flex-1 max-w-[32px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[19px]">
                {k === matched ? activeKey : k}
              </div>
            ))}
          </div>
          {/* Row 3 */}
          {page === 'alpha' ? renderAlphaRow3() : renderNumericRow3()}
        </>
      )}

      {/* Row 4 */}
      <div className="flex justify-center gap-1.5 px-0.5">
        <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[42px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-sm">
          {page === 'alpha' ? '123' : 'ABC'}
        </div>
        <div onClick={() => playClick('modifier')} style={{ backgroundColor: specialKeyBg }} className="w-[32px] h-[42px] rounded-lg shadow-sm flex items-center justify-center">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm1.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
        </div>
        <div onClick={() => playClick('special')} style={{ backgroundColor: activeKey === ' ' ? keyActiveBg : keyBg }} className="flex-1 max-w-[160px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[15px] cursor-pointer active:opacity-75 relative z-10 select-none">space</div>
        <div onClick={() => playClick('special')} style={{ backgroundColor: specialKeyBg, color: isDark ? '#FFFFFF' : '#000000' }} className="w-[80px] h-[42px] rounded-lg shadow-sm flex items-center justify-center text-[15px] font-semibold cursor-pointer active:opacity-75 relative z-10 select-none">Done</div>
      </div>
    </div>
  );
}
