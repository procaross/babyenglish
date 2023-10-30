'use client';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { sendMessage } from '@/app/actions/sendMessage';
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import { User } from '@prisma/client';
import { CldUploadButton } from 'next-cloudinary';
import { useEffect, useOptimistic, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageContainer from './MessageContainer';
import MessageInput from './MessageInput';

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

  const handleUpload = async (result: any) => {
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
        currentUser={currentUser?.id}
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
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUpload}
          uploadPreset="nw1jh9kf"
        >
          <HiPhoto size={30} className="text-sky-500" />
        </CldUploadButton>
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
              console.log(error);
            }
          }}
          className="flex w-full items-center gap-2 lg:gap-4"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="发送一条消息"
          />
          <button
            type="submit"
            className="
            cursor-pointer 
            rounded-full 
            bg-sky-500 
            p-2 
            transition 
            hover:bg-sky-600
          "
          >
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Main;
