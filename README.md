# NovaStore

A modern, production-style full-stack e-commerce platform built with **Next.js 16, React 19, TypeScript, Prisma, PostgreSQL, and Tailwind CSS**.

NovaStore is designed as a complete e-commerce experience with a customer-facing storefront and a feature-rich admin dashboard, focusing on clean architecture, reusable components, responsive UI, and a consistent user experience.

## ✨ Features

### Storefront

- 🛍️ Product browsing and product categories
- 🔎 Product search and advanced filtering
- 💰 Price range filtering
- 📦 Product variants and inventory availability
- 🖼️ Product image galleries with fullscreen preview
- ⚡ Quick View for products
- ❤️ Favorites / wishlist
- 🛒 Shopping cart
- ⭐ Product ratings and reviews
- 💬 Review replies
- 👤 User authentication and profile
- 📍 Multiple delivery addresses
- 📋 Order history and order details
- 🎨 Responsive RTL Persian interface
- 🌓 Theme switching
- ✨ Smooth UI animations

### Admin Dashboard

- 📊 Dashboard overview and analytics
- 📦 Product management
- 🏷️ Categories and brands management
- 📋 Order management
- 👥 User management
- 📦 Inventory management
- ⭐ Review management
- 🎟️ Coupon management
- 🏠 Homepage and Hero product management
- 🖼️ Product image management
- 🔐 Role-based access control
- 🔎 Search, filtering and sorting
- 📝 Create and edit forms with validation
- 🔔 Consistent toast and error feedback

## 🏗️ Architecture

The project follows a **feature-first architecture** with a clear separation of responsibilities:

```text
UI Components
      ↓
Hooks / Application Logic
      ↓
Data Layer
      ↓
API / Database
```

The application uses **Server Components by default**, with Client Components introduced only where interactive browser-side behavior is required.

The codebase also emphasizes:

- Reusable components
- Custom hooks for complex logic
- Thin page components
- Separation of UI and business logic
- Type-safe data flow
- Consistent form handling and validation
- Shared loading and empty states
- Reusable admin patterns

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend & Database

- Next.js Server Actions / API
- Prisma ORM
- PostgreSQL

### Forms & Validation

- React Hook Form
- Zod

### Development

- pnpm
- ESLint
- Prettier
- Husky
- Commitlint
- lint-staged

## 📁 Project Structure

```text
src/
├── app/
├── components/
├── features/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── products/
│   ├── reviews/
│   └── ...
├── hooks/
├── lib/
└── ...
```

The `features` directory contains domain-specific functionality, while shared UI and utilities are kept separate for better maintainability and reuse.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm
- PostgreSQL

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/NovaStore.git
cd NovaStore
```

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

Seed the database:

```bash
pnpm prisma db seed
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## 🔐 Environment Variables

Create a `.env.local` file and configure the required environment variables for your local PostgreSQL database and application services.

Example:

```env
DATABASE_URL="your-postgresql-database-url"
```

Additional environment variables may be required depending on the configured services.

## 🧪 Quality Checks

Before committing changes, the project can be checked with:

```bash
pnpm lint
pnpm typecheck
```

## 🎯 Project Goals

NovaStore was built as a portfolio project to demonstrate practical experience with:

- Modern Next.js architecture
- Full-stack TypeScript development
- Database-driven applications
- Authentication and authorization
- Complex form handling
- E-commerce workflows
- Admin dashboard architecture
- Reusable component design
- Responsive RTL interfaces
- Maintainable and scalable code organization

## 📸 Screenshots

_Add screenshots or a demo preview here._

## 🌐 Demo

_Add your live demo URL here._

## 👨‍💻 Author

**Alireza Tahavori**

Frontend / Full-Stack Developer

---

Built with **Next.js, TypeScript, Prisma, PostgreSQL, and Tailwind CSS**.
