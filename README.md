<p align="center">
  <a href="https://bagisto.com/en/headless-ecommerce/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/bagisto/temp-media/0b0984778fae92633f57e625c5494ead1fe320c3/dark-logo-P5H7MBtx.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://bagisto.com/wp-content/themes/bagisto/images/logo.png">
      <img src="https://bagisto.com/wp-content/themes/bagisto/images/logo.png" alt="Bagisto logo">
    </picture>
  </a>
</p>

<p align="center">
    <a href="https://bagisto.com/en/headless-ecommerce/">Website</a> | <a href="https://bagisto.com/en/bagisto-headless-ecommerce-installation-guide/">Documentation</a> | <a href="https://forums.bagisto.com/">Forums</a> | <a href="https://www.facebook.com/groups/bagisto/">Community</a>
</p>

<p align="center">
    <a href="https://twitter.com/intent/follow?screen_name=bagistoshop"><img src="https://img.shields.io/twitter/follow/bagistoshop?style=social"></a>
    <a href="https://www.youtube.com/channel/UCbrfqnhyiDv-bb9QuZtonYQ"><img src="https://img.shields.io/youtube/channel/subscribers/UCbrfqnhyiDv-bb9QuZtonYQ?style=social"></a>
</p>

<p align="center">
    <a href="https://packagist.org/packages/bagisto/bagisto"><img src="https://poser.pugx.org/bagisto/bagisto/license.svg" alt="License"></a>
</p>

#  Bagisto Next.js Commerce

A [**headless eCommerce framework**](https://bagisto.com/en/headless-ecommerce/) built with **Next.js** and powered by **Bagisto**, designed for modern scalability and flexibility.
Through layered caching and optimized rendering strategies, it consistently achieves a **100/100 Core Web Vitals score**, delivering lightning-fast performance and seamless shopping experiences.

Check the [Documentation](https://headless-doc.bagisto.com/) to quickly set up your Headless eCommerce store.

**Bagisto Version:** v2.4.x

**Bagisto API:** v1.0.3

![Bagisto Headless Commerce Image](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-home.png)
## Features

- **Ultra-fast storefront** with 100/100 Core Web Vitals score.  
- **Layered caching** for API responses and page rendering.  
- Fully **responsive and mobile-friendly** design.  
- SEO optimized with meta tags, OpenGraph, and Twitter cards.  
- Secure authentication via **NextAuth.js**.  
- Powered by **Bagisto** GraphQL APIs for robust commerce functionality.  
- **Incremental Static Regeneration (ISR)** with revalidation.
  
Bagisto Open Source Headless eCommerce is optimized to deliver a **100/100 Core Web Vitals score** across devices, ensuring top-tier performance and user experience.

![Bagisto Headless Commerce Image](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-performance.png)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ and **npm**
- Check Bagisto [backend requirement detail](https://devdocs.bagisto.com/2.3/introduction/requirements.html#server-configuration)

---

## Installation

1) Install Bagisto
 
    Begin by [installing the Bagisto](https://devdocs.bagisto.com/) eCommerce platform on your server or local environment.

2) Install the Bagisto Headless Extension

    After installing Bagisto, install the [Bagisto Headless Extension](https://github.com/bagisto/bagisto-api) to expose the required APIs for your frontend.

3) Get your storefront up and running in one command:
   
   ```bash
   npx -y @bagisto-headless/create your-storefront
   ```
   
4) Configure `.env.local` in the Next.js Project

   In your Next.js frontend project, create or update your `.env.local` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BAGISTO_ENDPOINT` | Enter Your Bagisto Shop URL | `https://your-store.bagisto.com/` |
| `NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY` | Enter Your Bagisto Storefront Key | `pk_storefront_*************************` |
| `NEXTAUTH_URL` | Enter Your Headless Shop URL | `https://headless-store.com/` |
| `NEXTAUTH_SECRET` | Enter Your Headless Shop Secret | Generate with `openssl rand -base64 32` |
| `COMPANY_NAME` | Enter Your company name | Bagisto Headless Store |


**Important Notes**  
- You will need to use the environment variables defined in `.env.example` to run Next.js Commerce.  
- It’s recommended to use **Vercel Environment Variables**, but a `.env` file is sufficient for local development.  
- **Never commit your `.env` file** to version control — it contains secrets that would allow others to control your Bagisto store.


## One-Click Deploy to Netlify

Click the button above to deploy your own copy of Bagisto Headless eCommerce to Netlify instantly!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bagisto/nextjs-commerce)

---

**Vercel Setup**

Install the Vercel CLI:

```bash
npm i -g vercel
```

Link your local instance with Vercel and GitHub accounts (this creates the `.vercel` directory):

```bash
vercel link
```

Download your environment variables:

```bash
vercel env pull
```

---

**Run the development server:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
npm run start
```

---

## Usage

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```
Access the store at: [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production server |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run lint:fix` | Lint and auto-fix issues |
| `npm run typecheck` | Type-check the project with `tsc` |

---

## Products

The Open Source Headless eCommerce allows users to browse a wide range of products with built-in pagination and search functionality. Each product has its own detailed page showcasing images, descriptions, pricing, reviews, and availability.

Bagisto Headless Commerce APIs support multiple product types, including simple, configurable, bundled, and downloadable products, ensuring flexibility for different business needs.

![Bagisto Headless Commerce Image](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-product-page.png)

## Categories

Products are neatly organized into hierarchical categories, making it easy for customers to navigate the store. Each category page displays relevant product listings with filtering and sorting options for a better shopping experience.

The Open Source Headless eCommerce also ensures SEO-friendly category URLs with meta titles, descriptions, and breadcrumbs for improved discoverability.

![Bagisto Headless Commerce Image](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commercecategory.png)
 
## Checkout

The checkout process is fully functional, featuring complete cart management where customers can add, update, or remove items.

Both guest and logged-in users can proceed through checkout, selecting shipping addresses and preferred payment methods.

Once the order is placed, it is instantly synchronized with the Bagisto backend, enabling smooth order processing and management.

![Bagisto Headless Commerce Image](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-cart-checkout.png)

## Customer Panel

Registered customers get a dedicated account dashboard to manage their profile and activity across the store. Authentication is handled securely via **NextAuth.js**, ensuring each customer's data stays protected. On desktop the panel renders as a full-page layout with a persistent sidebar, while on mobile it opens as a slide-in drawer for a native, app-like experience.

The customer panel includes:

- **Profile** – View and edit personal details such as name, email, and password.

  ![Customer profile page](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-customer-profile.png)

- **Addresses** – Create, edit, and remove multiple shipping and billing addresses for faster checkout.
- **Orders** – Browse the complete order history and open any order to view its detailed summary, items, and current status.

  ![Customer order history](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-customer-order.png)

- **Downloadable Products** – Access and re-download purchased digital products from a single place.
- **Reviews** – Track and manage the product reviews submitted by the customer.
- **Wishlist** – Save favorite products to revisit, move to the cart, or purchase later.

  ![Customer wishlist](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-customer-wishlist.png)

- **Compare** – Add products to a comparison list to evaluate their attributes side by side.

  ![Product comparison](https://raw.githubusercontent.com/bagisto/temp-media/refs/heads/master/bagisto-headless-commerce-customer-compare.png)

All customer actions are synchronized in real time with the Bagisto backend through its GraphQL APIs.

## Community
Get Bagisto Headless Commerce support on [Facebook Group](https://www.facebook.com/groups/bagisto) and [Forum](https://forums.bagisto.com/)

## License
Bagisto headless eCommerce framework that will always remain free under the [MIT License](https://github.com/bagisto/nextjs-commerce/blob/main/license.md).

## Security Vulnerabilities
If you think that you have found a security issue in Bagisto Headless Commerce, please do not use the issue tracker and do not post it publicly. Instead, all security issues must be sent to [mailto:support@bagisto.com](mailto:support@bagisto.com).