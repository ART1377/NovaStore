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
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-black">
        {number}
      </span>
      <h2 className="text-lg font-black">{title}</h2>
    </div>
  );
}
