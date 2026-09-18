// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();

// Demo prices are realistic Iranian-market تومان amounts for September 2026.
// They are intentionally representative rather than tied to a single seller because
// imported electronics and original accessories fluctuate with FX, warranty and stock.
const catalog = [
  ['iPhone 16 Pro', 'iphone-16-pro', 169_900_000, 'Apple', 'Phones', 2],
  ['Galaxy S25', 'galaxy-s25', 149_900_000, 'Samsung', 'Phones', 3],
  ['AirPods Pro 2', 'airpods-pro-2', 35_990_000, 'Apple', 'Audio', 4],
  ['WH-1000XM6', 'wh-1000xm6', 39_900_000, 'Sony', 'Audio', 2],
  ['MacBook Air M4', 'macbook-air-m4', 208_800_000, 'Apple', 'Laptops', 8],
  ['Galaxy Watch 7', 'galaxy-watch-7', 33_900_000, 'Samsung', 'Wearables', 3],
  ['Nike Air Max Dn', 'nike-air-max-dn', 18_990_000, 'Nike', 'Footwear', 12],
  [
    'Adidas Ultraboost 5',
    'adidas-ultraboost-5',
    11_700_000,
    'Adidas',
    'Footwear',
    9,
  ],
  [
    'Logitech MX Master 4',
    'mx-master-4',
    9_900_000,
    'Logitech',
    'Accessories',
    7,
  ],
  ['Sony Bravia 8', 'sony-bravia-8', 199_900_000, 'Sony', 'TV & Home', 2],
  ['iPad Air M3', 'ipad-air-m3', 155_900_000, 'Apple', 'Tablets', 11],
  ['Galaxy Tab S10', 'galaxy-tab-s10', 89_900_000, 'Samsung', 'Tablets', 6],
  [
    'Apple Watch Series 10',
    'apple-watch-series-10',
    44_900_000,
    'Apple',
    'Wearables',
    4,
  ],
  ['Nike Tech Fleece', 'nike-tech-fleece', 11_900_000, 'Nike', 'Fashion', 14],
  ['Adidas Samba OG', 'adidas-samba-og', 14_900_000, 'Adidas', 'Footwear', 5],
  ['Sony WH-CH720N', 'sony-wh-ch720n', 10_900_000, 'Sony', 'Audio', 10],
  [
    'Anker 737 Power Bank',
    'anker-737-power-bank',
    8_900_000,
    'Anker',
    'Accessories',
    16,
  ],
  [
    'Logitech G Pro X 2',
    'logitech-g-pro-x2',
    26_900_000,
    'Logitech',
    'Gaming',
    8,
  ],
  [
    'PlayStation 5 Slim',
    'playstation-5-slim',
    132_000_000,
    'Sony',
    'Gaming',
    7,
  ],
  [
    'Apple Magic Keyboard',
    'apple-magic-keyboard',
    12_900_000,
    'Apple',
    'Accessories',
    13,
  ],
] as const;

const categoryFa: Record<string, string> = {
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

const brandFa: Record<string, string> = {
  Apple: 'اپل',
  Samsung: 'سامسونگ',
  Sony: 'سونی',
  Nike: 'نایکی',
  Adidas: 'آدیداس',
  Logitech: 'لاجیتک',
  Anker: 'انکر',
};

const productImages: Record<string, string[]> = {
  'iphone-16-pro': [
    'https://images.unsplash.com/photo-1592286927505-3a17b4a75c2a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85',
  ],
  'galaxy-s25': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=85',
  ],
  'airpods-pro-2': [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1588423771077-62bf12f9f3a9?auto=format&fit=crop&w=1200&q=85',
  ],
  'wh-1000xm6': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
  ],
  'macbook-air-m4': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85',
  ],
  'galaxy-watch-7': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=85',
  ],
  'nike-air-max-dn': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
  ],
  'adidas-ultraboost-5': [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=85',
  ],
  'mx-master-4': [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=85',
  ],
  'sony-bravia-8': [
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=85',
  ],
  'ipad-air-m3': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=85',
  ],
  'galaxy-tab-s10': [
    'https://images.unsplash.com/photo-1567703834930-c7e1d23b8d2b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=85',
  ],
  'apple-watch-series-10': [
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=1200&q=85',
  ],
  'nike-tech-fleece': [
    'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
  ],
  'adidas-samba-og': [
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=85',
  ],
  'sony-wh-ch720n': [
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1518441317601-6a7a4f7f4d7f?auto=format&fit=crop&w=1200&q=85',
  ],
  'anker-737-power-bank': [
    'https://images.unsplash.com/photo-1609592424815-5efb1c6a6a1a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1609592424955-5e5a6c7a4d2b?auto=format&fit=crop&w=1200&q=85',
  ],
  'logitech-g-pro-x2': [
    'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=85&sat=-40',
  ],
  'playstation-5-slim': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=85',
  ],
  'apple-magic-keyboard': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85',
  ],
};

async function resetDatabase() {
  await db.notification.deleteMany();
  await db.reviewReply.deleteMany();
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.payment.deleteMany();
  await db.shipment.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.wishlistItem.deleteMany();
  await db.address.deleteMany();
  await db.cart.deleteMany();
  await db.wishlist.deleteMany();
  await db.coupon.deleteMany();
  await db.productRelation.deleteMany();
  await db.productVariant.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.brand.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  await resetDatabase();

  const passwordHash = await hash('Admin123!', 10);

  const admin = await db.user.create({
    data: {
      name: 'مدیر نووا',
      email: 'admin@shop.dev',
      passwordHash,
      role: 'ADMIN',
    },
  });
  const demo = await db.user.create({
    data: {
      name: 'علی رضایی',
      email: 'demo@shop.dev',
      passwordHash,
      role: 'USER',
    },
  });
  const customer2 = await db.user.create({
    data: {
      name: 'سارا احمدی',
      email: 'sara@shop.dev',
      passwordHash,
      role: 'USER',
    },
  });
  const customer3 = await db.user.create({
    data: {
      name: 'محمد کریمی',
      email: 'mohammad@shop.dev',
      passwordHash,
      role: 'USER',
    },
  });
  const customer4 = await db.user.create({
    data: {
      name: 'نگار محمدی',
      email: 'negar@shop.dev',
      passwordHash,
      role: 'USER',
    },
  });

  const categoryMap = new Map<string, string>();
  for (const key of [...new Set(catalog.map((item) => item[4]))]) {
    const category = await db.category.create({
      data: {
        name: categoryFa[key] ?? key,
        slug: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `محصولات منتخب دسته ${categoryFa[key] ?? key}`,
        isActive: true,
      },
    });
    categoryMap.set(key, category.id);
  }

  const brandMap = new Map<string, string>();
  for (const key of [...new Set(catalog.map((item) => item[3]))]) {
    const brand = await db.brand.create({
      data: {
        name: brandFa[key] ?? key,
        slug: key.toLowerCase(),
        isActive: true,
      },
    });
    brandMap.set(key, brand.id);
  }

  const products = [];
  for (let index = 0; index < catalog.length; index += 1) {
    const [name, slug, price, brand, category, baseStock] = catalog[index];
    const product = await db.product.create({
      data: {
        name,
        slug,
        description: `${name} با طراحی مدرن و کیفیت مناسب برای استفاده روزمره. این محصول برای نمایش تجربه کامل فروشگاهی NovaStore در محیط دمو آماده شده است.`,
        price,
        compareAtPrice:
          index % 4 === 0
            ? Math.round((price * 1.18) / 500_000) * 500_000
            : null,
        status: 'PUBLISHED',
        featured: index < 6,
        publishedAt: daysAgo(index % 12),
        categoryId: categoryMap.get(category)!,
        brandId: brandMap.get(brand)!,
        images: {
          create: (productImages[slug] ?? [`/products/${slug}.svg`]).map(
            (url, imageIndex) => ({
              url,
              alt: `${name} - تصویر ${imageIndex + 1}`,
              sortOrder: imageIndex,
            }),
          ),
        },
      },
    });

    const variantCount = index % 3 === 0 ? 3 : index % 2 === 0 ? 2 : 1;
    const variantStock = Math.max(0, baseStock);
    for (let variantIndex = 0; variantIndex < variantCount; variantIndex += 1) {
      const sizes = ['S', 'M', 'L'];
      await db.productVariant.create({
        data: {
          productId: product.id,
          sku: `${slug}-${variantIndex + 1}`,
          name:
            variantCount === 1 ? 'مدل پیش‌فرض' : `مدل ${sizes[variantIndex]}`,
          color:
            variantCount > 1
              ? ['مشکی', 'سفید', 'خاکستری'][variantIndex]
              : undefined,
          size: variantCount > 1 ? sizes[variantIndex] : undefined,
          price: price + (variantIndex === 2 ? 100_000 : 0),
          stock: Math.max(0, variantStock - variantIndex * 2),
        },
      });
    }

    products.push(product);
  }

  // Initial homepage curation. Admin can change this from /admin/home.
  await db.homePlacement.deleteMany();
  await db.homePlacement.createMany({
    data: [
      { slot: 'HERO_PRODUCT', productId: products[0].id, position: 0 },
      ...products.slice(0, 4).map((product, position) => ({
        slot: 'FEATURED_PRODUCTS',
        productId: product.id,
        position,
      })),
    ],
  });

  for (let index = 1; index < products.length; index += 1) {
    const target = products[index - 1];
    if (index % 2 === 0) {
      await db.productRelation.create({
        data: { fromProductId: products[index].id, toProductId: target.id },
      });
    }
    if (index % 4 === 0 && products[index - 2]) {
      await db.productRelation.create({
        data: {
          fromProductId: products[index].id,
          toProductId: products[index - 2].id,
        },
      });
    }
  }

  await db.cart.create({ data: { userId: admin.id } });
  const demoCart = await db.cart.create({ data: { userId: demo.id } });
  await db.cart.create({ data: { userId: customer2.id } });
  await db.cart.create({ data: { userId: customer3.id } });
  await db.cart.create({ data: { userId: customer4.id } });

  const [phone, audio, laptop, watch, keyboard] = products;
  const phoneVariant = await db.productVariant.findFirstOrThrow({
    where: { productId: phone.id },
  });
  const audioVariant = await db.productVariant.findFirstOrThrow({
    where: { productId: audio.id },
  });
  const laptopVariant = await db.productVariant.findFirstOrThrow({
    where: { productId: laptop.id },
  });
  const watchVariant = await db.productVariant.findFirstOrThrow({
    where: { productId: watch.id },
  });
  const keyboardVariant = await db.productVariant.findFirstOrThrow({
    where: { productId: keyboard.id },
  });

  await db.cartItem.createMany({
    data: [
      {
        cartId: demoCart.id,
        productId: phone.id,
        variantId: phoneVariant.id,
        quantity: 1,
      },
      {
        cartId: demoCart.id,
        productId: audio.id,
        variantId: audioVariant.id,
        quantity: 2,
      },
      {
        cartId: demoCart.id,
        productId: keyboard.id,
        variantId: keyboardVariant.id,
        quantity: 1,
      },
    ],
  });

  const wishlist = await db.wishlist.create({ data: { userId: demo.id } });
  await db.wishlistItem.createMany({
    data: [
      { wishlistId: wishlist.id, productId: laptop.id },
      { wishlistId: wishlist.id, productId: watch.id },
      { wishlistId: wishlist.id, productId: products[17].id },
    ],
  });
  await db.wishlist.create({ data: { userId: admin.id } });
  await db.wishlist.create({ data: { userId: customer2.id } });
  await db.wishlist.create({ data: { userId: customer3.id } });
  await db.wishlist.create({ data: { userId: customer4.id } });

  const demoAddress = await db.address.create({
    data: {
      userId: demo.id,
      title: 'خانه',
      recipient: 'علی رضایی',
      phone: '09120000000',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1111111111',
      street: 'خیابان نمونه، کوچه اول، پلاک ۱۰',
      isDefault: true,
    },
  });
  const demoWorkAddress = await db.address.create({
    data: {
      userId: demo.id,
      title: 'محل کار',
      recipient: 'علی رضایی',
      phone: '09120000000',
      city: 'تهران',
      state: 'تهران',
      postalCode: '2222222222',
      street: 'خیابان ولیعصر، ساختمان نووا، طبقه ۳',
      isDefault: false,
    },
  });
  const saraAddress = await db.address.create({
    data: {
      userId: customer2.id,
      title: 'خانه',
      recipient: 'سارا احمدی',
      phone: '09121111111',
      city: 'اصفهان',
      state: 'اصفهان',
      postalCode: '3333333333',
      street: 'خیابان چهارباغ، پلاک ۲۲',
      isDefault: true,
    },
  });
  const mohammadAddress = await db.address.create({
    data: {
      userId: customer3.id,
      title: 'خانه',
      recipient: 'محمد کریمی',
      phone: '09122222222',
      city: 'شیراز',
      state: 'فارس',
      postalCode: '4444444444',
      street: 'بلوار چمران، کوچه ۵',
      isDefault: true,
    },
  });
  const negarAddress = await db.address.create({
    data: {
      userId: customer4.id,
      title: 'خانه',
      recipient: 'نگار محمدی',
      phone: '09123333333',
      city: 'تبریز',
      state: 'آذربایجان شرقی',
      postalCode: '5555555555',
      street: 'بلوار آزادی، کوچه ۸',
      isDefault: true,
    },
  });

  const coupon = await db.coupon.create({
    data: {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minOrder: 5000,
      usageLimit: 100,
      usedCount: 7,
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  });
  await db.coupon.create({
    data: {
      code: 'SPRING50',
      type: 'FIXED',
      value: 5000,
      minOrder: 10000,
      usageLimit: 25,
      usedCount: 3,
      expiresAt: new Date('2027-03-21'),
      isActive: true,
    },
  });
  await db.coupon.create({
    data: {
      code: 'INACTIVE10',
      type: 'PERCENTAGE',
      value: 10,
      minOrder: 0,
      isActive: false,
    },
  });

  const orderInputs = [
    {
      userId: demo.id,
      addressId: demoAddress.id,
      orderNumber: 'NS-DEMO-001',
      product: phone,
      variant: phoneVariant,
      quantity: 1,
      status: 'DELIVERED',
      shipping: 'DELIVERED',
      payment: 'PAID',
      days: 18,
      discount: 0,
      shippingCost: 0,
      tracking: 'NS-TRACK-001',
    },
    {
      userId: demo.id,
      addressId: demoWorkAddress.id,
      orderNumber: 'NS-DEMO-002',
      product: audio,
      variant: audioVariant,
      quantity: 2,
      status: 'SHIPPED',
      shipping: 'SHIPPED',
      payment: 'PAID',
      days: 6,
      discount: 4980,
      shippingCost: 799,
      tracking: 'NS-TRACK-002',
    },
    {
      userId: customer2.id,
      addressId: saraAddress.id,
      orderNumber: 'NS-DEMO-003',
      product: laptop,
      variant: laptopVariant,
      quantity: 1,
      status: 'PROCESSING',
      shipping: 'PENDING',
      payment: 'PAID',
      days: 3,
      discount: 0,
      shippingCost: 799,
      tracking: undefined,
    },
    {
      userId: customer3.id,
      addressId: mohammadAddress.id,
      orderNumber: 'NS-DEMO-004',
      product: watch,
      variant: watchVariant,
      quantity: 1,
      status: 'PAID',
      shipping: 'PENDING',
      payment: 'PAID',
      days: 2,
      discount: 0,
      shippingCost: 1499,
      tracking: undefined,
    },
    {
      userId: customer4.id,
      addressId: negarAddress.id,
      orderNumber: 'NS-DEMO-005',
      product: keyboard,
      variant: keyboardVariant,
      quantity: 2,
      status: 'CANCELLED',
      shipping: 'RETURNED',
      payment: 'REFUNDED',
      days: 12,
      discount: 0,
      shippingCost: 799,
      tracking: undefined,
    },
    {
      userId: customer2.id,
      addressId: saraAddress.id,
      orderNumber: 'NS-DEMO-006',
      product: products[17],
      variant: await db.productVariant.findFirstOrThrow({
        where: { productId: products[17].id },
      }),
      quantity: 1,
      status: 'PENDING',
      shipping: 'PENDING',
      payment: 'PENDING',
      days: 1,
      discount: 0,
      shippingCost: 799,
      tracking: undefined,
    },
  ] as const;

  for (const input of orderInputs) {
    const unitPrice = input.variant.price ?? input.product.price;
    const subtotal = unitPrice * input.quantity;
    const total = Math.max(0, subtotal - input.discount + input.shippingCost);
    const order = await db.order.create({
      data: {
        orderNumber: input.orderNumber,
        userId: input.userId,
        addressId: input.addressId,
        subtotal,
        discount: input.discount,
        shippingCost: input.shippingCost,
        total,
        couponCode:
          input.orderNumber === 'NS-DEMO-002' ? coupon.code : undefined,
        paymentStatus: input.payment,
        orderStatus: input.status,
        shippingStatus: input.shipping,
        paymentMethod: 'DEMO',
        createdAt: daysAgo(input.days),
        items: {
          create: [
            {
              productId: input.product.id,
              variantId: input.variant.id,
              name: input.product.name,
              unitPrice,
              quantity: input.quantity,
            },
          ],
        },
        payment:
          input.payment !== 'PENDING'
            ? {
                create: {
                  amount: total,
                  status: input.payment,
                  provider: 'DEMO',
                  transactionId: `DEMO-${input.orderNumber}`,
                },
              }
            : undefined,
        shipment: {
          create: {
            method:
              input.shippingCost === 1499
                ? 'EXPRESS'
                : input.shippingCost === 0
                  ? 'FREE'
                  : 'STANDARD',
            trackingNumber: input.tracking,
            status: input.shipping,
            createdAt: daysAgo(input.days - 1),
          },
        },
      },
    });

    if (input.status !== 'CANCELLED' && input.payment === 'PAID') {
      await db.productVariant.update({
        where: { id: input.variant.id },
        data: { stock: Math.max(0, input.variant.stock - input.quantity) },
      });
    }

    if (input.userId === demo.id) {
      await db.notification.create({
        data: {
          userId: demo.id,
          type:
            input.status === 'DELIVERED'
              ? 'ORDER_DELIVERED'
              : input.status === 'SHIPPED'
                ? 'ORDER_SHIPPED'
                : 'ORDER_CREATED',
          title:
            input.status === 'DELIVERED'
              ? 'سفارش تحویل شد'
              : input.status === 'SHIPPED'
                ? 'سفارش ارسال شد'
                : 'سفارش ثبت شد',
          message: `سفارش ${order.orderNumber} در وضعیت ${input.status === 'DELIVERED' ? 'تحویل شده' : input.status === 'SHIPPED' ? 'ارسال شده' : 'ثبت شده'} قرار دارد.`,
          link: `/account/orders/${order.id}`,
          isRead: input.status === 'DELIVERED',
          createdAt: daysAgo(Math.max(0, input.days - 1)),
        },
      });
    }
  }

  const seededReviews = [
    [
      phone.id,
      demo.id,
      5,
      'کیفیت ساخت عالی است و دوربین و نمایشگر واقعاً رضایت‌بخش هستند.',
    ],
    [
      phone.id,
      customer2.id,
      4,
      'گوشی خیلی خوبی است؛ فقط انتظار داشتم شارژدهی کمی بهتر باشد.',
    ],
    [
      audio.id,
      demo.id,
      5,
      'صدای شفاف و بیس خیلی خوبی دارد و برای استفاده روزمره عالی است.',
    ],
    [
      audio.id,
      customer3.id,
      5,
      'نویزکنسلینگ فوق‌العاده است و راحتی هدفون هم خیلی خوب است.',
    ],
    [
      laptop.id,
      customer2.id,
      5,
      'برای برنامه‌نویسی و کار روزمره عملکرد بسیار روانی دارد.',
    ],
    [
      watch.id,
      customer3.id,
      4,
      'طراحی زیبا و امکانات کامل دارد؛ رابط کاربری هم روان است.',
    ],
    [
      watch.id,
      customer4.id,
      5,
      'صفحه‌نمایش عالی و شارژدهی قابل قبول؛ از خرید راضی هستم.',
    ],
    [
      products[6].id,
      demo.id,
      4,
      'کفش راحت و سبک است و برای استفاده طولانی‌مدت مناسب به نظر می‌رسد.',
    ],
    [
      products[11].id,
      customer2.id,
      5,
      'نمایشگر بزرگ و کیفیت تصویر خیلی خوبی دارد.',
    ],
    [
      products[17].id,
      customer4.id,
      5,
      'برای گیمینگ انتخاب بسیار خوبی است و کیفیت صدا عالی است.',
    ],
    [
      products[19].id,
      customer3.id,
      4,
      'طراحی مینیمال و تجربه تایپ بسیار خوبی دارد.',
    ],
  ] as const;

  const createdReviews = [];
  for (let index = 0; index < seededReviews.length; index += 1) {
    const [productId, userId, rating, comment] = seededReviews[index];
    const review = await db.review.create({
      data: {
        productId,
        userId,
        rating,
        comment,
        createdAt: daysAgo(index + 1),
      },
    });
    createdReviews.push(review);
  }

  const seededReplies = [
    [
      createdReviews[0].id,
      customer3.id,
      'ممنون از توضیحتان؛ من هم بعد از چند روز استفاده همین تجربه را داشتم.',
    ],
    [
      createdReviews[0].id,
      demo.id,
      'خواهش می‌کنم. برای من شارژدهی با تنظیمات بهینه خیلی بهتر شد.',
    ],
    [
      createdReviews[1].id,
      customer4.id,
      'من هم بیشتر با همین موضوع موافقم، ولی در مجموع تجربه خوبی بود.',
    ],
    [
      createdReviews[3].id,
      demo.id,
      'کاملاً موافقم؛ مخصوصاً برای کار طولانی مدت روی گوش خیلی راحت است.',
    ],
    [
      createdReviews[4].id,
      customer3.id,
      'برای برنامه‌نویسی هم ترکیب سرعت و شارژدهی خوبی دارد.',
    ],
    [
      createdReviews[7].id,
      demo.id,
      'من هم برای پیاده‌روی طولانی امتحانش کردم و راحت بود.',
    ],
  ] as const;

  for (const [reviewId, userId, comment] of seededReplies) {
    await db.reviewReply.create({ data: { reviewId, userId, comment } });
  }

  await db.notification.createMany({
    data: [
      {
        userId: demo.id,
        type: 'PAYMENT_SUCCESSFUL',
        title: 'پرداخت موفق',
        message: 'پرداخت سفارش شما با موفقیت ثبت شد.',
        link: '/account/orders',
        isRead: false,
        createdAt: new Date(),
      },
      {
        userId: demo.id,
        type: 'PROMOTION',
        title: 'پیشنهاد ویژه',
        message: 'برای شما یک کد تخفیف جدید فعال شده است.',
        link: '/products?discounted=true',
        isRead: false,
        createdAt: daysAgo(2),
      },
      {
        userId: customer2.id,
        type: 'ORDER_CREATED',
        title: 'سفارش جدید',
        message: 'سفارش NS-DEMO-006 در انتظار پردازش است.',
        link: '/account/orders',
        isRead: false,
      },
      {
        userId: admin.id,
        type: 'LOW_STOCK',
        title: 'موجودی کم',
        message: 'چند محصول مهم فروشگاه به موجودی کم رسیده‌اند.',
        link: '/admin/products',
        isRead: false,
      },
    ],
  });

  console.log('✅ NovaStore seed completed');
  console.log('Admin: admin@shop.dev / Admin123!');
  console.log('Customer: demo@shop.dev / Admin123!');
  console.log(
    'Demo cart: 3 items · wishlist: 3 items · orders: 6 · notifications seeded',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
