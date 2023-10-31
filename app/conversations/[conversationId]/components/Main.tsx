'use client';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { sendMessage } from '@/app/actions/sendMessage';
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import { User } from '@prisma/client';
import { useEffect, useOptimistic, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MessageSendButton from './MessageSendButton';
import MessageSendInput from './MessageSendInput';
import MessageContainer from './MessagesContainer';

interface MainProps {
  initialMessages: FullMessageType[];
}

const Main: React.FC<MainProps> = ({ initialMessages = [] }) => {
  const { conversationId } = useConversation();
  const [messages, setMessages] = useState(initialMessages);
  const [currentUser, setCurrentUser] = useState({} as User);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const handleUploadPhoto = async (result: any) => {
    await sendMessage(null, conversationId, result.info.secure_url);
  };

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => {
      return [...state, newMessage] as FullMessageType[];
    }
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setCurrentUser((await getCurrentUser()) as User);
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      <MessageContainer
        optimisticMessages={optimisticMessages}
        // currentUser={currentUser?.id}
      />
      <div
        className="
        flex 
        w-full 
        items-center 
        gap-2 
        border-t 
        bg-white 
        px-4 
        py-4 
        lg:gap-4
      "
      >
        <form
          action={async (formData) => {
            setValue('message', '', { shouldValidate: true });
            addOptimisticMessage({
              id: Math.random().toString(),
              conversationId: conversationId,
              createdAt: Date.now(),
              body: formData.get('message'),
              image: null,
              sender: currentUser,
              senderId: currentUser.id,
              pending: true,
            });
            const { error } = await sendMessage(formData, conversationId);
            if (error) {
              toast.error('Oooops! 消息发送失败！' + error);
            }
          }}
          className="flex w-full flex-row-reverse items-center gap-2 lg:gap-4"
        >
          <MessageSendButton />
          <MessageSendInput
            id="message"
            register={register}
            handleUploadPhoto={handleUploadPhoto}
            errors={errors}
            required
            placeholder="发送一条消息"
          />
        </form>
      </div>
    </>
  );
};

export default Main;
