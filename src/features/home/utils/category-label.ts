// src/features/home/utils/category-label.ts
const CATEGORY_LABELS: Record<string, string> = {
  Phones: 'موبایل',
  Audio: 'صوتی',
  Laptops: 'لپ‌تاپ',
  Wearables: 'پوشیدنی',
  Footwear: 'کفش',
  Accessories: 'لوازم جانبی',
  'TV & Home': 'خانه و تلویزیون',
  Tablets: 'تبلت',
  Fashion: 'پوشاک',
  Gaming: 'گیمینگ',
};

export function getCategoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value;
}
