'use client';

import { Plus } from 'lucide-react';

import { ActionTooltip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button onClick={() => onOpen('createServer')} className='group flex items-center'>
          <div className='mx-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-3xl bg-background transition-all group-hover:rounded-2xl group-hover:bg-blue-500 dark:bg-neutral-700'>
            <Plus className='text-gray-400 group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
