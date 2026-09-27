// commitlint.config.mjs

const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'style',
        'docs',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'ux',
        'a11y',
        'theme',
        'layout',
        'metadata',
        'seo',
        'pwa',

        'api',
        'db',
        'auth',
        'session',
        'prisma',
        'seed',

        'catalog',
        'cart',
        'checkout',
        'orders',
        'wishlist',
        'compare',
        'reviews',
        'notifications',
        'account',
        'home',
        'search',
        'filters',

        'admin',
        'products',
        'inventory',
        'coupons',
        'users',

        'cloudinary',
        'pusher',

        'config',
        'deps',
        'deps-dev',
        'hooks',
        'scripts',
        'readme',
        'git',
        'ci-cd',
      ],
    ],
    'subject-full-stop': [2, 'never', '.'],
    'subject-empty': [2, 'never'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};

export default config;
