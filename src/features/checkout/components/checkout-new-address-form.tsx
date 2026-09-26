// src/features/checkout/components/checkout-new-address-form.tsx
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { addressSchema } from '@/features/account/validation/address.schema';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { numericInputValue } from '@/lib/utils';
import { useState, type ChangeEvent } from 'react';
import { useCreateCheckoutAddress } from '../hooks/use-checkout-actions';
import type { CheckoutAddress } from '../types/checkout-types';

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

/**
 * Inline "add new address" form. Lives in its own component so the
 * surrounding section is purely about selection and the form can be tested
 * (and reused, if needed) independently.
 */
export function CheckoutNewAddressForm({
  isFirstAddress,
  onCreated,
  onCancel,
}: {
  isFirstAddress: boolean;
  onCreated: (addressId: string) => void;
  onCancel: () => void;
}) {
  const [newAddress, setNewAddress] = useState<NewAddress>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const createAddress = useCreateCheckoutAddress();

  const setField = (field: keyof NewAddress, value: string) =>
    setNewAddress((current) => ({ ...current, [field]: value }));

  const submit = () => {
    // Normalize Persian/Arabic digits before validating, matching the
    // account flow so users can type either script.
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
    createAddress.mutate(
      { ...parsed.data, isDefault: isFirstAddress },
      {
        onSuccess: (address) => {
          onCreated(address.id);
          setNewAddress(EMPTY_ADDRESS);
        },
      },
    );
  };

  return (
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
                  setField(
                    field,
                    field === 'postalCode'
                      ? event.target.value.replace(/\D/g, '')
                      : event.target.value,
                  )
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
        <Button disabled={createAddress.isPending} onClick={submit}>
          {createAddress.isPending ? 'در حال ذخیره...' : 'ذخیره آدرس'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
}
