import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';

import EmptyState from '@/app/components/EmptyState';
import Header from './components/Header';
import Main from './components/Main';

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="h-full lg:pl-80">
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:pl-80">
      <div className="flex h-full flex-col">
        <Header conversation={conversation} />
        <Main initialMessages={messages} />
      </div>
    </div>
  );
};

export default ChatId;
