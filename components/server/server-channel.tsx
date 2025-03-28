'use client';

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/action-tooltip';
import { useModal, ModalType } from '@/hooks/use-modal-store';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const navigateToChannel = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const handleOpenModal = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={navigateToChannel}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}>
      <Icon className='h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}>
        {channel.name}
      </p>
      {channel.name === 'general' && (
        <Lock className='ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400' />
      )}
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='edit'>
            <Edit
              onClick={(e) => handleOpenModal(e, 'editChannel')}
              className='hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300'
            />
          </ActionTooltip>
          <ActionTooltip label='delete'>
            <Trash
              onClick={(e) => handleOpenModal(e, 'deleteChannel')}
              className='hidden h-4 w-4 text-rose-500 transition hover:text-rose-600 group-hover:block dark:text-rose-400 dark:hover:text-rose-300'
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};
