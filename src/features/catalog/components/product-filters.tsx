// src/features/catalog/components/product-filters.tsx
'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '@/components/ui/range-slider';
import { formatPrice } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import type { CatalogOption, ProductFilters as FilterState } from '../types/catalog-types';
import { useProductFilters } from '../hooks/use-product-filters';
import { FilterButton } from './filter-button';
import { FilterCheckRow } from './filter-check-row';
import { FilterSection } from './filter-section';

type ProductFiltersProps = {
  filters: FilterState;
  categories: CatalogOption[];
  brands: CatalogOption[];
  onChange: (key: string, value: string) => void;
  onRangeChange: (minPrice: string, maxPrice: string) => void;
  onClear: () => void;
};

export function ProductFilters({
  filters,
  categories,
  brands,
  onChange,
  onRangeChange,
  onClear,
}: ProductFiltersProps) {
  const {
    open,
    setOpen,
    minPrice,
    maxPrice,
    parsedMin,
    parsedMax,
    priceMin,
    priceMax,
    priceStep,
    applyPrice,
    handlePriceSlider,
    commitSliderPrice,
    handlePriceInput,
  } = useProductFilters({ filters, onChange, onRangeChange });

  const content = (
    <div className="space-y-6">
      <FilterSection title="دسته‌بندی">
        <div className="grid gap-1">
          <FilterButton active={!filters.category} onClick={() => onChange('category', '')}>
            همه دسته‌ها
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              active={filters.category === category.slug}
              onClick={() => onChange('category', category.slug)}
            >
              {category.name}
            </FilterButton>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="برند">
        <div className="grid gap-1">
          <FilterButton active={!filters.brand} onClick={() => onChange('brand', '')}>
            همه برندها
          </FilterButton>
          {brands.map((brand) => (
            <FilterButton
              key={brand.id}
              active={filters.brand === brand.slug}
              onClick={() => onChange('brand', brand.slug)}
            >
              {brand.name}
            </FilterButton>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="بازه قیمت">
        <div className="border-nova-line bg-nova-hover/40 rounded-2xl border p-3">
          <RangeSlider
            min={priceMin}
            max={priceMax}
            step={priceStep}
            minValue={parsedMin}
            maxValue={parsedMax}
            onChange={handlePriceSlider}
            aria-label="انتخاب بازه قیمت"
            onMouseUp={commitSliderPrice}
            onTouchEnd={commitSliderPrice}
          />
          <div className="text-nova-muted mt-2 flex items-center justify-between gap-3 text-[11px]">
            <span>از {formatPrice(parsedMin)}</span>
            <span>تا {formatPrice(parsedMax)}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            value={minPrice}
            onChange={(event) => handlePriceInput('min', event.target.value)}
            placeholder="از"
            aria-label="حداقل قیمت"
          />
          <Input
            inputMode="numeric"
            value={maxPrice}
            onChange={(event) => handlePriceInput('max', event.target.value)}
            placeholder="تا"
            aria-label="حداکثر قیمت"
          />
        </div>
        <Button size="sm" variant="outline" className="mt-2 w-full" onClick={applyPrice}>
          اعمال بازه
        </Button>
      </FilterSection>

      <FilterSection title="وضعیت">
        <FilterCheckRow
          checked={filters.available === 'true'}
          onChange={(checked) => onChange('available', checked ? 'true' : '')}
          label="فقط کالاهای موجود"
        />
        <FilterCheckRow
          checked={filters.discounted === 'true'}
          onChange={(checked) => onChange('discounted', checked ? 'true' : '')}
          label="فقط تخفیف‌دارها"
        />
      </FilterSection>

      <FilterSection title="حداقل امتیاز">
        <Select value={filters.rating ?? ''} onChange={(event) => onChange('rating', event.target.value)}>
          <option value="">همه امتیازها</option>
          <option value="4">۴ ستاره و بیشتر</option>
          <option value="3">۳ ستاره و بیشتر</option>
          <option value="2">۲ ستاره و بیشتر</option>
        </Select>
      </FilterSection>

      <FilterSection title="مرتب‌سازی">
        <Select value={filters.sort ?? 'newest'} onChange={(event) => onChange('sort', event.target.value)}>
          <option value="newest">جدیدترین</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="popular">پرفروش‌ترین</option>
          <option value="rating">بهترین امتیاز</option>
        </Select>
      </FilterSection>

      <Button variant="outline" className="w-full" onClick={onClear}>
        پاک کردن همه فیلترها
      </Button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-nova-line bg-nova-surface inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold lg:hidden"
      >
        <SlidersHorizontal size={17} /> فیلترها
      </button>

      <aside className="border-nova-line bg-nova-surface hidden rounded-3xl border p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-nova-muted text-xs">انتخاب هوشمند</p>
            <h2 className="mt-1 font-black">فیلترها</h2>
          </div>
          <span className="bg-nova-soft text-nova-primary rounded-full px-2 py-1 text-[10px]">URL</span>
        </div>
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            aria-label="بستن فیلتر"
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="bg-nova-surface absolute inset-y-0 right-0 flex w-[min(94vw,400px)] max-w-full flex-col overflow-y-auto p-4 shadow-2xl sm:p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-nova-muted text-xs">جستجو و کشف</p>
                <h2 className="mt-1 text-xl font-black">فیلترها</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="hover:bg-nova-soft rounded-full p-2" aria-label="بستن">
                <X size={20} />
              </button>
            </div>
            <div>{content}</div>
            <Button className="mt-4 w-full" onClick={() => setOpen(false)}>
              نمایش نتایج
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
