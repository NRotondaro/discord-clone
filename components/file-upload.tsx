'use client';

import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';

import '@uploadthing/react/styles.css';
import { useState } from 'react';

interface FileUploadProps {
  onChange: (url?: string, type?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileName, setFileName] = useState('');
  const fileType = fileName?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='server-image-upload' className='rounded-full' />
        <button
          onClick={() => onChange('')}
          className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'>
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 truncate text-sm text-indigo-500 hover:underline dark:text-indigo-400'>
          {fileName}
        </a>
        <button
          onClick={() => onChange('')}
          className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'>
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      uploadProgressGranularity='coarse'
      onClientUploadComplete={(res) => {
        const fileUrl = res?.[0].ufsUrl;
        const fileType = res?.[0].type;
        onChange(fileUrl, fileType);
        setFileName(res?.[0].name);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
