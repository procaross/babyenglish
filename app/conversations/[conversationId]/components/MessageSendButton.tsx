import { useFormStatus } from 'react-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';

export default function MessageSendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`ease-[cubic-bezier(0.35, 0, 0.25, 1)] cursor-pointer rounded-full p-2 transition-all duration-700 ${
        pending
          ? 'animate-bounce cursor-wait bg-gray-400'
          : 'bg-sky-500 hover:bg-sky-600'
      }`}
    >
      {pending ? (
        <AiOutlineLoading3Quarters
          size={18}
          className="animate-spin text-white"
        />
      ) : (
        <IoSend size={18} className="text-white" />
      )}
    </button>
  );
}
