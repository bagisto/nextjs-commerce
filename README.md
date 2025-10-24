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

Check the [Documentation](https://bagisto.com/en/bagisto-headless-ecommerce-installation-guide/) to quickly set up your Headless eCommerce store.

**Bagisto Version:** v2.3.0

**Bagisto GraphQL API:** v2.3.0

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

- **Node.js** 18+ and **pnpm**
- Check Bagisto [backend requirement detail](https://devdocs.bagisto.com/2.3/introduction/requirements.html#server-configuration)

---

## Installation

1) Install Bagisto
 
    Begin by [installing the Bagisto](https://devdocs.bagisto.com/) eCommerce platform on your server or local environment.

2) Install the Bagisto Headless Extension

    After installing Bagisto, install the [Bagisto Headless Extension](https://github.com/bagisto/headless-ecommerce/) to expose the required APIs for your frontend.

3) Get your storefront up and running in one command:
   
   ```bash
   npx -y @bagisto-headless/create your-storefront
   ```
   
4) Configure `.env.local` in the Next.js Project

   In your Next.js frontend project, create or update your `.env.local` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `SITE_NAME` | Your store name | `My Awesome Store` |
| `BAGISTO_STORE_DOMAIN` | Your Bagisto backend URL | `https://api.mystore.com` |
| `IMAGE_DOMAIN` | Domain for product images | `api.mystore.com` |
| `REVALIDATION_DURATION` | ISR cache duration (seconds) | `3600` |
| `NEXTAUTH_URL` | Your frontend URL | `https://mystore.com` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with `openssl rand -base64 32` |


**Important Notes**  
- You will need to use the environment variables defined in `.env.example` to run Next.js Commerce.  
- It’s recommended to use **Vercel Environment Variables**, but a `.env` file is sufficient for local development.  
- **Never commit your `.env` file** to version control — it contains secrets that would allow others to control your Bagisto store.  

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
pnpm dev
```

**Build for production:**

```bash
pnpm build
pnpm start
```

---

## Usage

Start the development server:

```bash
pnpm dev
```
Access the store at:[http://localhost:3000](http://localhost:3000)

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

## Community
Get Bagisto Headless Commerce support on [Facebook Group](https://www.facebook.com/groups/bagisto) and [Forum](https://forums.bagisto.com/)

## License
Bagisto headless eCommerce framework that will always remain free under the [MIT License](https://github.com/bagisto/nextjs-commerce/blob/main/license.md).

## Security Vulnerabilities
If you think that you have found a security issue in Bagisto Headless Commerce, please do not use the issue tracker and do not post it publicly. Instead, all security issues must be sent to [mailto:support@bagisto.com](mailto:support@bagisto.com).
