'use client';

import { useFormStatus } from 'react-dom';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
}) => {
  const { pending } = useFormStatus();
  return (
    <div className="relative w-full">
      <input
        disabled={pending}
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className={`w-full rounded-full px-4 py-2 font-light text-black focus:outline-none ${
          pending ? 'bg-neutral-200' : 'bg-neutral-100'
        }`}
      />
    </div>
  );
};

export default MessageInput;
