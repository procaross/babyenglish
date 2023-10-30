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
  currentUser: String;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  optimisticMessages = [],
  currentUser = '',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(optimisticMessages);

  const { conversationId } = useConversation();

  const optimisticMessagesRef = useRef(optimisticMessages);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
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
    const currentUserMessagesLen = messages.filter(
      (message) => message.senderId === currentUser
    ).length;
    const otherUserMessages = messages.filter(
      (message) => message.senderId !== currentUser
    );
    console.log('debug-other', otherUserMessages);
    const currentUserOptimisticMessagesLen = optimisticMessages.filter(
      (message) => message.senderId === currentUser
    ).length;
    if (currentUserMessagesLen >= currentUserOptimisticMessagesLen) {
      optimisticMessagesRef.current = messages;
    } else {
      optimisticMessagesRef.current = optimisticMessages;
    }
    let mergedArray = otherUserMessages.concat(optimisticMessagesRef.current);
    mergedArray.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf());
    let uniqueArray = mergedArray.filter((item, index) => {
      if (index === 0) return true;
      if (
        item.senderId === mergedArray[index - 1].senderId &&
        item.createdAt.valueOf() === mergedArray[index - 1].createdAt.valueOf()
      )
        return false;
      return true;
    });
    optimisticMessagesRef.current = uniqueArray;
  }, [messages, optimisticMessages]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [optimisticMessages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {optimisticMessagesRef.current.map((message, i) => (
        <MessageBox key={message.id} data={message} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default MessageContainer;
