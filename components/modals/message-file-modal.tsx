'use client';

import axios from 'axios';
import qs from 'query-string';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
  file: z.object({
    fileUrl: z.string().min(1, {
      message: 'Attachment is required.',
    }),
    fileType: z.string().min(1, {
      message: 'File Type is required.',
    }),
  }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'messageFile';
  const { apiUrl, query } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: {
        fileUrl: '',
        fileType: '',
      },
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });
      const { fileUrl, fileType } = values.file;
      await axios.post(url, {
        content: fileUrl,
        fileUrl,
        fileType,
      });

      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
    axios.get;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Add an attachment</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='messageFile'
                          value={field.value.fileUrl}
                          onChange={(fileUrl, fileType) => {
                            field.onChange({
                              ...field.value,
                              fileUrl,
                              fileType,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
