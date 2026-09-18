// src/features/account/types/address.ts
export type Address = {
  id: string;
  title: string;
  recipient: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  street: string;
  isDefault: boolean;
};
