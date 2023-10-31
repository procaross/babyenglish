'use client';

// import axios from "axios";
import { useEffect, useRef, useState } from 'react';

import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusher';
import { FullMessageType } from '@/app/types';
import { find } from 'lodash';
import MessageBox from './MessageBox';

interface MessageContainerProps {
  optimisticMessages: FullMessageType[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  optimisticMessages = [],
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(optimisticMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox key={message.id} data={message} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default MessageContainer;
