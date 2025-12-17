import { useEffect, useState } from "react";

const backendResponse = {
  "conversations": [
    {
      "id": "1",
      "title": "Pregled troškova",
      "lastMessage": "To je 15% manje od prošlog mjeseca!",
      "updatedAt": "2025-12-15T10:01:08Z",
      "unreadCount": 0
    },
    {
      "id": "2",
      "title": "Najveći troškovi",
      "lastMessage": "Top 5 kategorija: hrana, prijevoz, računi...",
      "updatedAt": "2025-12-14T14:00:12Z",
      "unreadCount": 2
    },
    {
      "id": "3",
      "title": "Štednja i ciljevi",
      "lastMessage": "Glavni cilj: uštedjeti 6.000 €",
      "updatedAt": "2025-12-13T09:31:20Z",
      "unreadCount": 0
    }
  ]
}


export interface ConversationMeta {
  id: string;
  title?: string;
  lastMessage?: string;
  updatedAt?: Date;
  unreadCount?: number;
}

interface UseChatHistoryReturn {
  items: ConversationMeta[];
}

export const useChatHistory = (): UseChatHistoryReturn => {
  const [items, setItems] = useState<ConversationMeta[]>([]);

  const fetchHistory = async () => {

    

    const mapped = backendResponse.conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    lastMessage: conv.lastMessage,
    updatedAt: new Date(conv.updatedAt),
    unreadCount: conv.unreadCount,
    }));

    setItems(mapped);

  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { items };
};
