import { Search, MessageCircle } from 'lucide-react';
import { Input } from './ui/input';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'That Bali trip looks amazing! 🏝️',
    timestamp: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Travel Squad',
    avatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150',
    lastMessage: 'When should we book flights?',
    timestamp: '1h ago',
    unread: 5,
  },
  {
    id: '3',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Thanks for sharing that post!',
    timestamp: '3h ago',
    unread: 0,
  },
  {
    id: '4',
    name: 'Sarah & Mike',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: 'We should plan a trip together',
    timestamp: '1d ago',
    unread: 0,
  },
  {
    id: '5',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: 'Have you been to Japan?',
    timestamp: '2d ago',
    unread: 0,
  },
];

export function ChatScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-gray-100 border-0"
              />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-100">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                )}
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{chat.unread}</span>
                  </div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {chat.timestamp}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State (hidden when there are chats) */}
        {mockChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 text-center">
              Share trips with friends to start a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


