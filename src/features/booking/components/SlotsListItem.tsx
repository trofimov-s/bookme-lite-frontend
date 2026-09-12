import { cn } from 'cn';

import { useBooking } from '../context/BookingContext';

import type { SlotItemResponseDto } from '@/api/schema';
import { TIME_UTILS } from '@/shared/utils/time.utils';

type SlotListItemProps = {
  slot: SlotItemResponseDto;
  index: number;
};

function SlotsListItem({ slot, index }: SlotListItemProps) {
  const { selectedSlotIndex, onSlotChange } = useBooking();

  return (
    <button
      disabled={slot.isLocked}
      className={cn(
        'py-2.5 rounded-lg text-sm font-medium transition-all duration-100 border',
        slot.isLocked && 'text-muted-foreground/30 border-border line-through cursor-not-allowed bg-muted/30',
        selectedSlotIndex === index
          ? 'bg-foreground text-background border-foreground'
          : 'text-foreground border-border hover:border-foreground/30 hover:bg-accent',
      )}
      onClick={() => !slot.isLocked && onSlotChange(index)}
    >
      {TIME_UTILS.minutesToTimeString(slot.startTime)}
    </button>
  );
}

export default SlotsListItem;
