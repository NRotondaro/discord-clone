'use client';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Member, MemberRole, Profile } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { ActionTooltip } from '@/components/action-tooltip';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  fileType: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  ADMIN: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  fileType,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'application/pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [form, content]);

  return (
    <div className='group relative flex w-full items-center p-4 transition hover:bg-black/5'>
      <div className='group flex w-full items-start gap-x-2'>
        <div onClick={onMemberClick} className='cursor-pointer transition hover:drop-shadow-md'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex w-full flex-col'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p
                onClick={onMemberClick}
                className='cursor-pointer text-sm font-semibold hover:underline'>
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>{roleIconMap[member.role]}</ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary'>
              <Image src={fileUrl} alt={content} fill className='object-cover' />
            </a>
          )}
          {isPDF && (
            <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 truncate text-sm text-indigo-500 hover:underline dark:text-indigo-400'>
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400',
              )}>
              {content}
              {isUpdated && !deleted && (
                <span className='mx-2 text-[10px] text-zinc-500 dark:to-zinc-400'>(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className='flex w-full items-center gap-x-2 pt-2'
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            disabled={isLoading}
                            className='border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200'
                            placeholder='Edit the message'
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button onClick={() => setIsEditing(false)} size='sm' variant='ghost'>
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading} size='sm' variant='primary'>
                  Save
                </Button>
              </form>
              <span className='mt-1 text-[10px] text-zinc-400'>
                Press ESC to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800 md:flex'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
          )}
          {canEditMessage && (
            <ActionTooltip label='Delete'>
              <Trash
                onClick={() =>
                  onOpen('deleteMessage', { apiUrl: `${socketUrl}/${id}`, query: socketQuery })
                }
                className='ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-rose-600 dark:hover:text-rose-300'
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};
