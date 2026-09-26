// src/features/checkout/components/checkout-address-section.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Check, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import type { CheckoutAddress } from '../types/checkout-types';
import { CheckoutNewAddressForm } from './checkout-new-address-form';
import { CheckoutSectionTitle } from './checkout-section-title';

export function CheckoutAddressSection({
  addresses,
  addressId,
  onSelectAddress,
}: {
  addresses: CheckoutAddress[];
  addressId: string;
  onSelectAddress: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const selected = addresses.find((address) => address.id === addressId);

  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardContent className="p-5 md:p-7">
        <CheckoutSectionTitle number="۱" title="آدرس تحویل" />

        {selected && (
          <div className="border-nova-primary/25 bg-nova-hover mt-5 rounded-2xl border p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <MapPin className="text-nova-primary size-4" />
                  <span className="font-black">{selected.title}</span>
                  <span className="bg-nova-surface text-nova-primary rounded-full px-2 py-1 text-[10px] font-bold">
                    آدرس انتخاب‌شده
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold">
                  {selected.recipient} · {selected.phone}
                </p>
                <p className="text-nova-ink mt-1 text-sm leading-7">
                  {selected.state}، {selected.city}، {selected.street}
                </p>
                <p className="text-nova-muted mt-1 text-xs">
                  کد پستی: {selected.postalCode}
                </p>
              </div>
              <span className="text-nova-muted text-xs font-semibold">
                برای تغییر، یکی از آدرس‌های پایین را انتخاب کن.
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelectAddress(address.id)}
              className={`rounded-2xl border p-4 text-right transition ${
                addressId === address.id
                  ? 'border-nova-primary bg-nova-hover ring-nova-primary/15 ring-2'
                  : 'hover:border-nova-line-strong'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold">{address.title}</span>
                {addressId === address.id && (
                  <Check className="text-nova-primary size-5" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium">
                {address.recipient} · {address.phone}
              </p>
              <p className="text-nova-muted mt-1 text-xs leading-6">
                {address.state}، {address.city}، {address.street} · کدپستی{' '}
                {address.postalCode}
              </p>
            </button>
          ))}
        </div>

        {addresses.length > 0 && (
          <p className="text-nova-muted mt-4 text-xs">
            آدرس‌های ذخیره‌شده از پروفایل شما به‌صورت خودکار در اینجا قابل
            انتخاب هستند.
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="hover:bg-nova-hover mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-3 text-sm font-bold transition"
        >
          <Plus className="size-4" /> افزودن آدرس جدید
        </button>

        {showForm && (
          <CheckoutNewAddressForm
            isFirstAddress={addresses.length === 0}
            onCreated={(id) => {
              onSelectAddress(id);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
