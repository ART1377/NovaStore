// src/components/shared/query-state.tsx
import { Button } from '@/components/ui/button';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export function QueryLoading({
  label = 'در حال دریافت اطلاعات...',
}: {
  label?: string;
}) {
  return (
    <div className="bg-nova-surface rounded-3xl border p-12 text-center">
      <div className="bg-nova-soft mx-auto h-10 w-10 animate-pulse rounded-2xl" />
      <p className="text-nova-primary mt-4 text-sm">{label}</p>
    </div>
  );
}
export function QueryError({
  message = 'دریافت اطلاعات با مشکل مواجه شد.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border-nova-danger-border bg-nova-surface rounded-3xl border p-12 text-center">
      <AlertCircle className="text-nova-danger mx-auto" size={22} />
      <h3 className="mt-3 font-black">امکان دریافت اطلاعات وجود ندارد</h3>
      <p className="text-nova-primary mx-auto mt-2 max-w-md text-sm leading-6">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RefreshCw size={15} />
          تلاش دوباره
        </Button>
      )}
    </div>
  );
}
export function QueryEmpty({
  title = 'موردی پیدا نشد.',
  description = 'اطلاعاتی برای نمایش وجود ندارد.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="bg-nova-surface rounded-3xl border p-12 text-center">
      <Inbox className="mx-auto text-[#cbd5e1]" size={30} />
      <h3 className="mt-4 font-black">{title}</h3>
      <p className="text-nova-primary mt-2 text-sm">{description}</p>
    </div>
  );
}
