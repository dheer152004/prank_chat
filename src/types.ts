export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'audioCall' | 'videoCall' | 'document' | 'location' | 'contact' | 'payment' | 'deleted' | 'gif' | 'reel';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'none' | 'sent' | 'delivered' | 'read';
  reaction?: string;
  dateMarker?: string;
  messageType?: MessageType;
  attachmentUrl?: string;
  isForwarded?: boolean;
  replyToText?: string;
  replyName?: string;
  replyUsername?: string;
  replyProfilePic?: string;
}

export interface MessageData {
  senderName: string;
  username: string;
  profilePic: string;
  message: string;
  timestamp: string;
  readReceipt: 'none' | 'sent' | 'delivered' | 'read';
  platform: 'whatsapp' | 'twitter' | 'facebook' | 'telegram' | 'snapchat' | 'instagram' | 'reddit' | 'tinder' | 'chatgpt';
  theme: 'light' | 'dark';
  likesCount?: number;
  retweetsCount?: number;
  isOnline?: boolean;
  isVerified: boolean;
  isNewChat?: boolean;
  feeling: string;
  isBitmoji?: boolean;
  chatDate?: string;
  statusText?: string;
  bgUrl?: string;
  chatMessages: ChatMessage[];
  fontFamily?: string;
  fontSize?: number;
  statusBarTime?: string;
  showWifi?: boolean;
  showBluetooth?: boolean;
  showVoLTE?: boolean;
  batteryPercentage?: number;
  showBattery?: boolean;
  showNotch?: boolean;
  showCellular?: boolean;
  showYoutube?: boolean;
  showGmail?: boolean;
  showAlarm?: boolean;
  isUnmatched?: boolean;
  showUnmatchModal?: boolean;
  isTyping?: boolean;
  replayTypingText?: string | null;
  typingKey?: string | null;
}
