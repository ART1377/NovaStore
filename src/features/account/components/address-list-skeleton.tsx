// src/features/account/components/address-list-skeleton.tsx
export function AddressListSkeleton() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <div className="bg-nova-line h-40 animate-pulse rounded-3xl" />
        <div className="bg-nova-line h-40 animate-pulse rounded-3xl" />
      </div>
      <div className="space-y-4">
        <div className="bg-nova-line h-40 animate-pulse rounded-3xl" />
        <div className="bg-nova-line h-40 animate-pulse rounded-3xl" />
      </div>
    </div>
  );
}
