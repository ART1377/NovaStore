// commitlint.config.mjs

const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce conventional types.
    'type-enum': [
      2,
      'always',
      [
        'feat', // فیچر جدید
        'fix', // باگ‌فیکس
        'refactor', // بازنویسی بدون تغییر رفتار
        'perf', // بهبود performance
        'style', // تغییرات ظاهری، بدون تغییر منطق
        'docs', // مستندات
        'test', // تست
        'build', // build system / deps
        'ci', // CI config
        'chore', // کارهای متفرقه
        'revert', // برگرداندن commit
      ],
    ],
    // Scopes are optional, but if used they should match one of these.
    // Comment out `scope-enum` if you want free-form scopes.
    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'api',
        'auth',
        'db',
        'cart',
        'checkout',
        'catalog',
        'orders',
        'wishlist',
        'notifications',
        'compare',
        'home',
        'admin',
        'account',
        'config',
        'deps',
        'deps-dev',
        'hooks',
        'seed',
      ],
    ],
    // Subject must not end with a period.
    'subject-full-stop': [2, 'never', '.'],
    // Subject must be non-empty, lowercase, no leading/trailing space.
    'subject-empty': [2, 'never'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    // Type and subject must be separated by ": ".
    'header-max-length': [2, 'always', 100],
    // Body leading blank line.
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};

export default config;
