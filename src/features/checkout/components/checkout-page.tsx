// src/features/checkout/components/checkout-page.tsx
'use client';

import { ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/hooks/use-cart';
import { useAddresses } from '@/features/account/hooks/use-addresses';
import { useCheckout } from '../hooks/use-checkout';
import { CheckoutSkeleton } from './checkout-skeleton';
import { CheckoutAddressSection } from './checkout-address-section';
import { CheckoutShippingSection } from './checkout-shipping-section';
import { CheckoutCouponSection } from './checkout-coupon-section';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { getClientErrorMessage } from '@/lib/client-error';

export function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
    error: addressesErrorDetails,
    refetch: refetchAddresses,
  } = useAddresses();

  const checkout = useCheckout({ addresses, cartItems: cart?.items ?? [] });

  if (cartLoading || addressesLoading) return <CheckoutSkeleton />;

  if (addressesError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="border-nova-danger/20 bg-nova-danger-soft/20 rounded-3xl border p-6">
          <h1 className="text-nova-danger text-xl font-black">
            دریافت آدرس‌ها انجام نشد
          </h1>
          <p className="text-nova-danger/80 mt-2 text-sm">
            {getClientErrorMessage(
              addressesErrorDetails,
              'لطفاً دوباره تلاش کنید.',
            )}
          </p>{' '}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => refetchAddresses()}
          >
            تلاش مجدد
          </Button>
        </div>
      </main>
    );
  }

  if (!cart?.items?.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="bg-muted mx-auto flex size-16 items-center justify-center rounded-2xl">
          <Truck />
        </div>
        <h1 className="mt-5 text-2xl font-black">سبد خرید شما خالی است</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          برای ورود به مرحله تسویه، ابتدا محصولی به سبد خرید اضافه کنید.
        </p>
        <Button className="mt-6" onClick={checkout.goToProducts}>
          مشاهده محصولات
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs">
            نووا / سبد خرید / تسویه حساب
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            تکمیل سفارش
          </h1>
        </div>
        <div className="bg-card text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-2 text-xs">
          <ShieldCheck className="size-4" /> پرداخت امن و رمزگذاری‌شده
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <CheckoutAddressSection
            addresses={addresses}
            addressId={checkout.addressId}
            onSelectAddress={checkout.setSelectedAddress}
          />
          <CheckoutShippingSection
            shippingMethod={checkout.shippingMethod}
            hasFreeShipping={checkout.hasFreeShipping}
            onChange={checkout.changeShipping}
          />
          <CheckoutCouponSection
            couponCode={checkout.couponCode}
            onCodeChange={checkout.setCouponCode}
            coupon={checkout.coupon}
            message={checkout.couponMessage}
            messageType={checkout.couponMessageType}
            isPending={checkout.couponMutation.isPending}
            onApply={checkout.applyCoupon}
            onClear={checkout.clearCoupon}
          />
        </div>
        <CheckoutOrderSummary
          cart={cart}
          subtotal={checkout.subtotal}
          discount={checkout.discount}
          shippingCost={checkout.shippingCost}
          total={checkout.total}
          canSubmit={Boolean(checkout.addressId)}
          isSubmitting={checkout.checkoutMutation.isPending}
          onSubmit={checkout.submit}
        />
      </div>
    </main>
  );
}
