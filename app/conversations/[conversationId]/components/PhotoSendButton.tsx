import { CldUploadButton } from 'next-cloudinary';
import { HiPhoto } from 'react-icons/hi2';

export default function PhotoSendButton(handleUploadPhoto: any) {
  return (
    <CldUploadButton
      options={{ maxFiles: 1 }}
      onUpload={handleUploadPhoto}
      uploadPreset="nw1jh9kf"
    >
      <HiPhoto
        size={24}
        className="ease-[cubic-bezier(0.35, 0, 0.25, 1)] text-gray-300 transition-all hover:text-gray-400"
      />
    </CldUploadButton>
  );
}
