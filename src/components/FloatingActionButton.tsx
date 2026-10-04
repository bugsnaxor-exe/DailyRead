import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onAddBookFromFile: (file: File) => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddBookFromFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedExtensions = [
    '.epub', '.pdf', '.mobi', '.azw3', '.fb2', '.djvu',
    '.doc', '.docx', '.rtf', '.odt', '.txt', '.cbr', '.cbz'
  ].join(',');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddBookFromFile(files[0]);
    }
    // Reset value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedExtensions}
        onChange={handleFileChange}
        className="hidden"
        id="book-upload-input"
      />

      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Add book or document"
          className="fab-glow w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
          style={{
            backgroundColor: 'var(--emerald-primary)'
          }}
          title="Add Books or Documents from System"
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
};
