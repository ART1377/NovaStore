// src/features/checkout/components/checkout-section-title.tsx
export function CheckoutSectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-nova-primary grid size-8 place-items-center rounded-full text-sm font-black text-white">
        {number}
      </span>
      <h2 className="text-lg font-black">{title}</h2>
    </div>
  );
}
