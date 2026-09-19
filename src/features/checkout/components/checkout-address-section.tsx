// src/features/checkout/components/checkout-address-section.tsx
import { useState, type ChangeEvent } from 'react';
import { z } from 'zod';
import { Check, MapPin, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { useCreateCheckoutAddress } from '../hooks/use-checkout-actions';
import { CheckoutSectionTitle } from './checkout-section-title';
import type { CheckoutAddress } from '../types/checkout-types';
import { addressSchema } from '@/features/account/validation/address.schema';
import { numericInputValue } from '@/lib/utils';

type NewAddress = Omit<CheckoutAddress, 'id' | 'isDefault'>;

const EMPTY_ADDRESS: NewAddress = {
  title: 'خانه',
  recipient: '',
  phone: '',
  city: 'تهران',
  state: 'تهران',
  postalCode: '',
  street: '',
};

const FIELD_LABELS: Record<keyof NewAddress, string> = {
  title: 'عنوان آدرس',
  recipient: 'نام گیرنده',
  phone: 'شماره موبایل',
  city: 'شهر',
  state: 'استان',
  postalCode: 'کد پستی',
  street: 'آدرس کامل',
};

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
  const [newAddress, setNewAddress] = useState<NewAddress>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const addAddressMutation = useCreateCheckoutAddress();

  const selected = addresses.find((address) => address.id === addressId);

  const addAddress = () => {
    const parsed = addressSchema.safeParse({
      ...newAddress,
      phone: numericInputValue(newAddress.phone),
      postalCode: numericInputValue(newAddress.postalCode),
    });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    addAddressMutation.mutate(
      { ...newAddress, isDefault: addresses.length === 0 },
      {
        onSuccess: (address) => {
          onSelectAddress(address.id);
          setShowForm(false);
          setNewAddress(EMPTY_ADDRESS);
          setErrors({});
        },
      },
    );
  };

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
          <div className="bg-nova-hover/60 mt-4 rounded-2xl p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {(Object.keys(EMPTY_ADDRESS) as Array<keyof NewAddress>).map(
                (field) => (
                  <FormField
                    key={field}
                    label={FIELD_LABELS[field]}
                    required
                    error={errors[field]}
                    className={field === 'street' ? 'md:col-span-2' : ''}
                  >
                    <Input
                      value={newAddress[field]}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setNewAddress((current) => ({
                          ...current,
                          [field]:
                            field === 'postalCode'
                              ? event.target.value.replace(/\D/g, '')
                              : event.target.value,
                        }))
                      }
                      aria-invalid={!!errors[field]}
                      inputMode={
                        field === 'phone'
                          ? 'tel'
                          : field === 'postalCode'
                            ? 'numeric'
                            : undefined
                      }
                      maxLength={field === 'postalCode' ? 10 : undefined}
                    />
                  </FormField>
                ),
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                disabled={addAddressMutation.isPending}
                onClick={addAddress}
              >
                {addAddressMutation.isPending
                  ? 'در حال ذخیره...'
                  : 'ذخیره آدرس'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                انصراف
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
