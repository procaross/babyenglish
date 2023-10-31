"use server"
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";

export async function sendMessage(
  formData?: any,
  conversationId?: string,
  image?: string,
) {
  try {
    const currentUser = await getCurrentUser();
    const message = formData && formData.get("message");

    if (!currentUser?.id || !currentUser?.email) {
      return  {
        message: "not verified",
      };
    }

    const newMessage = await prisma.message.create({
      include: {
        sender: true
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
      }
    });

    
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
        }
      }
    });

    await pusherServer.trigger(conversationId ? conversationId : '', 'messages:new', newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    return  {
      message: "successfully sending the message",
    };
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return {
      error: error,
    };
  }
}