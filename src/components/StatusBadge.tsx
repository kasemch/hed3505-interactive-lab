import type { ActivityStatus } from '../types';

const statusStyles: Record<ActivityStatus, string> = {
  INITIAL: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-[color-mix(in_srgb,var(--color-caution)_20%,white)] text-[#8a6d00]',
  SUBMITTED: 'bg-[color-mix(in_srgb,var(--color-teal)_15%,white)] text-[var(--color-teal)]',
  REVIEW: 'bg-[color-mix(in_srgb,var(--color-success)_15%,white)] text-[var(--color-success)]',
};

export function StatusBadge({ status }: { status: ActivityStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
