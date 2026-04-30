import { useState, useEffect } from 'react';
import { MdDone, MdDoneAll } from 'react-icons/md';

// Common ticks for read receipts
export const CheckSingle = () => (
  <MdDone className="w-4 h-4 opacity-70" />
);

export const CheckDouble = ({ isRead }: { isRead?: boolean }) => (
  <MdDoneAll className={`w-4 h-4 ${isRead ? 'text-[#34B7F1] opacity-100' : 'opacity-70'}`} />
);

export const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
