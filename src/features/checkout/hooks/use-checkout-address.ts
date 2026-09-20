// src/features/checkout/hooks/use-checkout-address.ts
'use client';

import { useState } from 'react';
import type { CheckoutAddress } from '../types/checkout-types';

export function useCheckoutAddress(addresses: CheckoutAddress[]) {
  const [selectedAddress, setSelectedAddress] = useState('');

  const addressId =
    selectedAddress ||
    addresses.find((address) => address.isDefault)?.id ||
    addresses[0]?.id ||
    '';

  return { addressId, setSelectedAddress };
}
