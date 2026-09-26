// src/features/catalog/hooks/use-product-filters.ts
'use client';

import { PRICE_FILTER_RANGE } from '@/constants/constants';
import { toEnglishDigits } from '@/lib/utils';
import { useMemo, useState } from 'react';
import type { ProductFilters as FilterState } from '../types/catalog-types';

type UseProductFiltersParams = {
  filters: FilterState;
  onChange: (key: string, value: string) => void;
  onRangeChange: (minPrice: string, maxPrice: string) => void;
};

const PRICE_MIN = PRICE_FILTER_RANGE.MIN;
const PRICE_MAX = PRICE_FILTER_RANGE.MAX;
const PRICE_STEP = PRICE_FILTER_RANGE.STEP;

export function useProductFilters({
  filters,
  onChange,
  onRangeChange,
}: UseProductFiltersParams) {
  const [open, setOpen] = useState(false);
  const urlMinPrice = filters.minPrice ?? '';
  const urlMaxPrice = filters.maxPrice ?? '';
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [lastUrlMinPrice, setLastUrlMinPrice] = useState(urlMinPrice);
  const [lastUrlMaxPrice, setLastUrlMaxPrice] = useState(urlMaxPrice);

  if (urlMinPrice !== lastUrlMinPrice) {
    setLastUrlMinPrice(urlMinPrice);
    setMinPrice(urlMinPrice);
  }
  if (urlMaxPrice !== lastUrlMaxPrice) {
    setLastUrlMaxPrice(urlMaxPrice);
    setMaxPrice(urlMaxPrice);
  }

  const parsedMin = useMemo(
    () =>
      Math.max(PRICE_MIN, Math.min(Number(minPrice || PRICE_MIN), PRICE_MAX)),
    [minPrice],
  );
  const parsedMax = useMemo(
    () =>
      Math.max(parsedMin, Math.min(Number(maxPrice || PRICE_MAX), PRICE_MAX)),
    [maxPrice, parsedMin],
  );

  const applyPrice = () => {
    onRangeChange(
      parsedMin > PRICE_MIN ? String(parsedMin) : '',
      parsedMax < PRICE_MAX ? String(parsedMax) : '',
    );
  };

  const handlePriceSlider = ([nextMin, nextMax]: [number, number]) => {
    setMinPrice(String(nextMin));
    setMaxPrice(String(nextMax));
  };

  const commitSliderPrice = () => {
    const nextMin = Number(minPrice || PRICE_MIN);
    const nextMax = Number(maxPrice || PRICE_MAX);
    onRangeChange(
      nextMin > PRICE_MIN ? String(nextMin) : '',
      nextMax < PRICE_MAX ? String(nextMax) : '',
    );
  };

  const handlePriceInput = (key: 'min' | 'max', value: string) => {
    const normalized = toEnglishDigits(value).replace(/[^0-9]/g, '');
    if (key === 'min') setMinPrice(normalized);
    else setMaxPrice(normalized);
  };

  return {
    open,
    setOpen,
    minPrice,
    maxPrice,
    parsedMin,
    parsedMax,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    priceStep: PRICE_STEP,
    applyPrice,
    handlePriceSlider,
    commitSliderPrice,
    handlePriceInput,
    onChange,
  };
}
