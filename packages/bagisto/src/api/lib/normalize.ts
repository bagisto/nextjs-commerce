import type { Customer } from '../../type/customer'

export function normalizeProduct(product: any, config: any): any {
  const productFlat = product.productFlats.find(
    ({ locale }: any) => locale === 'en'
  )

  return {
    id: productFlat.id,
    name: productFlat.name,
    vendor: '',
    path: `/${productFlat.urlKey}`,
    slug: productFlat.urlKey,
    price: {
      value: productFlat?.price ?? 0,
      currencyCode: config.currencyCode,
    },
    descriptionHtml: productFlat.description,
    images: product.cacheGalleryImages.map((p: any) => ({
      url: p.originalImageUrl,
      altText: 'Random',
    })),
    variants: [],
    options: [],
  }
}

export function normalizeCustomer(customer: any): Customer {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  }
}

export function normalizeCart(data: any): any {
  return {
    id: data.id,
    customerId: data.customerId,
    email: data?.customerEmail,
    createdAt: data?.createdAt,
    currency: {
      code: 'USD',
    },
    lineItems: data.items.map(normalizeLineItem),
    lineItemsSubtotalPrice: data?.subTotal,
    subtotalPrice: data?.subTotal,
    totalPrice: data?.grandTotal,
  }
}

function normalizeLineItem(item: any): any {
  let product = item.product.productFlats[0]

  return {
    id: item.id,
    variantId: null,
    productId: String(product.id),
    name: product.name,
    quantity: item.quantity,
    variant: {
      id: product.id,
      sku: product?.sku,
      name: product.name,
      image: {
        url: item?.product?.images[0]?.url,
      },
      price: item?.basePrice,
    },
    options: [],
    path: `${product.urlKey}`,
  }
}
