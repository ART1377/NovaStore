// src/lib/themes.ts
export type ThemeId =
  | 'classic'
  | 'sunset'
  | 'violet'
  | 'teal'
  | 'sage'
  | 'meadow'
  | 'slate'
  | 'sapphire'
  | 'berry'
  | 'ink'
  | 'lava';
export type ThemeDefinition = { id: ThemeId; name: string; colors: string[] };
export const themes: ThemeDefinition[] = [
  {
    id: 'classic',
    name: 'نووا کلاسیک',
    colors: ['#17324d', '#577399', '#d8e2dc', '#f7f0e3'],
  },
  {
    id: 'sunset',
    name: 'غروب نارنجی',
    colors: ['#DF301C', '#FF9100', '#FFF1D1', '#00B7CD'],
  },
  {
    id: 'violet',
    name: 'بنفش مرجانی',
    colors: ['#1E104E', '#452E5A', '#FF653F', '#FFC85C'],
  },
  {
    id: 'teal',
    name: 'سبزآبی گرم',
    colors: ['#007979', '#24B1B1', '#FFE2AF', '#E37434'],
  },
  {
    id: 'sage',
    name: 'رز و زیتونی',
    colors: ['#BD4444', '#F1DEC4', '#73976A', '#677E61'],
  },
  {
    id: 'meadow',
    name: 'سبز و صورتی',
    colors: ['#D96868', '#F2F2F2', '#91AE6E', '#689D4B'],
  },
  {
    id: 'slate',
    name: 'اسلیت مدرن',
    colors: ['#2d3142', '#bfc0c0', '#ffffff', '#ef8354', '#4f5d75'],
  },
  {
    id: 'sapphire',
    name: 'یاقوتی برقی',
    colors: ['#5465ff', '#788bff', '#9bb1ff', '#bfd7ff', '#e2fdff'],
  },
  {
    id: 'berry',
    name: 'بری و آبی',
    colors: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'],
  },
  {
    id: 'ink',
    name: 'جوهر و نارنجی',
    colors: ['#04151f', '#183a37', '#efd6ac', '#c44900', '#432534'],
  },
  {
    id: 'lava',
    name: 'لاوا و سرمه‌ای',
    colors: ['#780000', '#c1121f', '#fdf0d5', '#003049', '#669bbc'],
  },
];
