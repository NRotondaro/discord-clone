'use client';

import { Plus } from 'lucide-react';

import { ActionTooltip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button
          onClick={() => onOpen('createServer')}
          className='group flex items-center'
        >
          <div className='flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-blue-500'>
            <Plus className='text-gray-400 group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
