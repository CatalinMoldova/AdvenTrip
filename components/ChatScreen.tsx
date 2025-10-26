import React from 'react';
import { Chat } from '../types';
import { Search, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatScreenProps {
  chats: Chat[];
  onChatClick?: (chatId: string) => void;
}

export function ChatScreen({ chats, onChatClick }: ChatScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== 'currentUser');
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-lg mx-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-gray-400 text-sm text-center mt-2">
              {searchQuery ? 'Try searching for someone else' : 'Start a conversation by sharing a trip!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => {
              const otherParticipant = chat.participants.find(p => p.id !== 'currentUser');
              const isUnread = false; // Placeholder - would come from backend
              
              return (
                <button
                  key={chat.id}
                  onClick={() => onChatClick?.(chat.id)}
                  className="w-full px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {otherParticipant?.avatar ? (
                      <img
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center">
                        <span className="text-green-700 text-xl font-semibold">
                          {otherParticipant?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className={`font-semibold text-gray-900 truncate ${isUnread ? 'font-bold' : ''}`}>
                        {otherParticipant?.name}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false })}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {chat.lastMessage?.senderId === 'currentUser' && 'You: '}
                      {chat.lastMessage?.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Coming Soon Banner (Optional) */}
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 text-center border border-green-200">
          <p className="text-sm text-gray-600 mb-2">💬 Full messaging coming soon!</p>
          <p className="text-xs text-gray-500">
            For now, share trip posts and connect with travelers through the app
          </p>
        </div>
      </div>
    </div>
  );
}

