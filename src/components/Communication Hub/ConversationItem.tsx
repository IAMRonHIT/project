import { Badge } from '@/components/Badge'

interface ConversationItemProps {
  conversation: {
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
  };
  onClick: () => void;
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  return (
    <div
      className="flex items-center p-4 hover:bg-ron-primary/10 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.name}`} />
        <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold">{conversation.name}</h4>
          <span className="text-xs text-ron-text-muted">{conversation.timestamp}</span>
        </div>
        <p className="text-sm text-ron-text-muted truncate">{conversation.lastMessage}</p>
      </div>
      {conversation.unread > 0 && (
        <Badge variant="default" className="ml-2">
          {conversation.unread}
        </Badge>
      )}
    </div>
  )
}
