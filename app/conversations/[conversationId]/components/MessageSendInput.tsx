'use client';

import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import PhotoSendButton from './PhotoSendButton';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  handleUploadPhoto: Function;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageSendInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  handleUploadPhoto,
  type,
  required,
  register,
}) => {
  const { pending } = useFormStatus();
  return (
    <div className="relative w-full transition-all duration-1000">
      <div
        className={clsx('absolute inset-y-0 left-3 flex items-center', {
          'pointer-events-none': pending,
        })}
      >
        <PhotoSendButton handleUploadPhoto={handleUploadPhoto} />
      </div>

      <input
        id={id}
        type={type}
        autoComplete={'off'}
        {...register(id, { required })}
        placeholder={placeholder}
        className={clsx(
          'ease-[cubic-bezier(0.35, 0, 0.25, 1)] w-full rounded-full px-4 py-2 pl-12 font-light text-black transition-all duration-700 focus:outline-none',
          {
            'bg-neutral-100': !pending,
            'pointer-events-none bg-neutral-200': pending,
          }
        )}
      />
    </div>
  );
};

export default MessageSendInput;
