import type { Customer } from '../../type/customer'

export function normalizeProduct(product: any, config: any): any {
  const productFlat = product.productFlats.find(
    ({ locale }: any) => locale === 'en'
  )

  return {
    id: product.id,
    type: product.type,
    name: productFlat.name,
    vendor: '',
    path: `/${productFlat.urlKey}`,
    slug: productFlat.urlKey,
    price: {
      value: parseFloat(product.priceHtml.regularWithoutCurrencyCode ?? 0),
      currencyCode: product.priceHtml.currencyCode,
    },
    descriptionHtml: productFlat.description,
    images: product.cacheGalleryImages.map((p: any) => ({
      url: p.originalImageUrl,
      altText: 'Random',
    })),
    variants:
      product.type === 'configurable' ? normalizeProductVariant(product) : [],
    options:
      product.type === 'configurable' ? normalizeProductOption(product) : [],
  }
}

export function normalizeProductVariant(product: any) {
  const findAttributeLabel = (attributeId: any) => {
    let attribute = product.configutableData.attributes.find(
      (attribute: any) => attribute.id == attributeId
    )

    return attribute.label
  }

  const findAttributeOptionLabel = (attributeOptionId: any) => {
    let attributeOption = product.configutableData.attributes
      .map((attribute: any) => {
        let attributeOption = attribute.options.find(
          (option: any) => option.id == attributeOptionId
        )

        return attributeOption ? attributeOption.label : null
      })
      .filter((attributeOption: any) => attributeOption != null)
      .pop()

    return attributeOption
  }

  return product.configutableData.index.map((variant: any) => {
    return {
      id: variant.id,
      options: variant.attributeOptionIds.map((attributeOptionId: any) => {
        return {
          __typename: 'MultipleChoiceOption',
          id: attributeOptionId.attributeId,
          displayName: findAttributeLabel(attributeOptionId.attributeId),
          values: [
            {
              id: attributeOptionId.attributeOptionId,
              label: findAttributeOptionLabel(
                attributeOptionId.attributeOptionId
              ),
              hexColors: [''],
            },
          ],
        }
      }),
    }
  })
}

export function normalizeProductOption(product: any) {
  const attributes = product.configutableData.attributes ?? []

  return attributes.map((attribute: any) => {
    return {
      id: attribute.id,
      displayName: attribute.label,
      values: attribute.options.map((option: any) => {
        return {
          id: option.id,
          label: option.label,
          hexColors: [''],
        }
      }),
    }
  })
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
    shippingCharges: data?.selectedShippingRate?.price ?? 0,
    addresses: normalizeCartAddresses(data?.addresses),
    hasAddresses: data?.addresses.length === 2,
    hasShipping: Boolean(data?.selectedShippingRate?.id),
    hasPayment: Boolean(data?.payment?.id),
  }
}

export function normalizeLineItem(item: any): any {
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

export function normalizeCartAddresses(addresses: any) {
  const addressDefaultValues = {
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    streetAddress: '',
    city: '',
    country: 'IN',
    state: 'DL',
    zipCode: '',
    phone: '',
  }

  let billingAddress = addresses.find(
    (address: any) => address.addressType === 'cart_billing'
  )

  let shippingAddress = addresses.find(
    (address: any) => address.addressType === 'cart_shipping'
  )

  return {
    billing: billingAddress
      ? {
          company: billingAddress.companyName,
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          email: billingAddress.email,
          streetAddress: billingAddress.address1,
          city: billingAddress.city,
          country: billingAddress.country,
          state: billingAddress.state,
          zipCode: billingAddress.postcode,
          phone: billingAddress.phone,
          useForShipping: false,
        }
      : { ...addressDefaultValues, useForShipping: true },
    shipping: shippingAddress
      ? {
          company: shippingAddress.companyName,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email,
          streetAddress: shippingAddress.address1,
          city: shippingAddress.city,
          country: shippingAddress.country,
          state: shippingAddress.state,
          zipCode: shippingAddress.postcode,
          phone: shippingAddress.phone,
        }
      : { ...addressDefaultValues },
  }
}

export function normalizeOrders(orders: []) {
  return orders.map((order: any) => {
    return {
      id: order.id,
      date: order.createdAt,
      total: order.grandTotal,
      status: order.status,
      orderCurrencyCode: order.orderCurrencyCode,
    }
  })
}
