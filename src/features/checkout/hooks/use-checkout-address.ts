// src/features/checkout/hooks/use-checkout-address.ts
'use client';

import { useState } from 'react';

export type AddressRef = { id: string; isDefault: boolean };

export function useCheckoutAddress(addresses: AddressRef[]) {
  const [selectedAddress, setSelectedAddress] = useState('');

  const addressId =
    selectedAddress ||
    addresses.find((address) => address.isDefault)?.id ||
    addresses[0]?.id ||
    '';

  return { addressId, setSelectedAddress };
}
