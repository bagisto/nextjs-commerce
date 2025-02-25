export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<BagistoCart, 'lines'> & {
  lines: CartItem[];
};
export type BagistoPaymentDataType = {
  cart: {
    id: string;
    shippingMethod: string;
    isGift: boolean;
    itemsCount: number;
    itemsQty: number;
    globalCurrencyCode: string;
    baseCurrencyCode: string;
    channelCurrencyCode: string;
    cartCurrencyCode: string;
    grandTotal: number;
    baseGrandTotal: number;
    subTotal: number;
    baseSubTotal: number;
    taxTotal: number;
    baseTaxTotal: number;
    discountAmount: number;
    baseDiscountAmount: number;
    isGuest: boolean;
    isActive: boolean;
    channelId: string;
    formattedPrice: {
      grandTotal: string;
      baseGrandTotal: string;
      subTotal: string;
      baseSubTotal: string;
      taxTotal: string;
      baseTaxTotal: string;
      discount: string;
      baseDiscount: string;
      discountedSubTotal: string;
      baseDiscountedSubTotal: string;
    };
    selectedShippingRate: {};
    payment: {
      id: string;
      method: string;
      methodTitle: string;
      cartId: string;
    };
  };
};

export type selectedPaymentMethodType = {
  id: string;
  method: string;
  methodTitle: string;
  cartId: string;
};

export type ChannelType = {
  id: string;
  code: string;
  name: string;
  description: string;
  theme: string;
  hostname: string;
  defaultLocaleId: number;
  baseCurrencyId: number;
  rootCategoryId: number;
  logoUrl: string;
  faviconUrl: string;
  success: string;
};

export type BagistoChannelOperation = {
  data: {
    getDefaultChannel: ChannelType;
  };
};

export type CartItem = {
  id: string;
  type: string;
  quantity: number;
  sku: string;
  name: string;
  couponCode: string;
  weight: string;
  totalWeight: string;
  baseTotalWeight: string;
  price: string;
  basePrice: string;
  total: string;
  baseTotal: string;
  taxPercent: string;
  taxAmount: string;
  baseTaxAmount: string;
  discountPercent: string;
  discountAmount: string;
  baseDiscountAmount: string;
  parentId: string;
  productId: string;
  cartId: string;
  taxCategoryId: string;
  customPrice: string;
  appliedCartRuleIds: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    type: string;
    name: string;
    attributeFamilyId: string;
    sku: string;
    parentId: string;
    variants: {
      id: string;
      type: string;
      attributeFamilyId: string;
      sku: string;
      parentId: string;
    };
    parent: {
      id: string;
      type: string;
      attributeFamilyId: string;
      sku: string;
      parentId: string;
    };
    attributeValues: {
      id: string;
      productId: string;
      attributeId: string;
      locale: string;
      channel: string;
      textValue: string;
      booleanValue: string;
      integerValue: string;
      floatValue: string;
      dateTimeValue: string;
      dateValue: string;
      jsonValue: string;
      attribute: {
        id: string;
        code: string;
        adminName: string;
        type: string;
      };
    };
    superAttributes: {
      id: string;
      code: string;
      adminName: string;
      type: string;
      position: string;
    };
    inventories: {
      id: string;
      qty: string;
      productId: string;
      inventorySourceId: string;
      vendorId: string;
    };
    images: {
      id: string;
      url: string;
      type: string;
      path: string;
      productId: string;
    }[];
  };
  formattedPrice: {
    price: string;
    basePrice: string;
    total: string;
    baseTotal: string;
    taxAmount: string;
    baseTaxAmount: string;
    discountAmount: string;
    baseDiscountAmount: string;
  };
  payment: selectedPaymentMethodType;
};

export type Collection = BagistoCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type ImageInfo = {
  url: string;
  type: string;
  path: string;
  productId: number;
  altText: string;
};

export type Menu = {
  id: string;
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    translations: {
      id: string;
      urlKey: string;
      metaDescription: string;
      metaTitle: string;
      pageTitle: string;
      metaKeywords: string;
      htmlContent: string;
      locale: string;
      cmsPageId: string;
    }[];
  }[];
};

export type Product = Omit<BagistoProductInfo, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: ImageInfo[];
};

export type ProductOption = {
  id: string;
  name: string;
  // values: string[];
  displayName: string;
  values: ProductOptionValues[];
};

export type ProductOptionData = {
  id: string;
  code: string;
  // values: string[];
  label: string;
  options: ProductOptionValuesData[];
};

export type ProductOptionValuesData = {
  id: string;
  label: string;
  products: [number];
};

export type ProductOptionValues = {
  label: string;
  hexColors?: string[];
};

export type ProductVariant = {
  id: string;
  label: string;
  sku: string;
  availableForSale: boolean;
  options: {
    id: string;
    label: string;
    products: [number];
  }[];
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: string;
};

export type SEO = {
  title: string;
  description: string;
};

export type BagistoCart = {
  id: string;
  type: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  shippingMethod: string;
  couponCode: string;
  itemsCount: string;
  itemsQty: string;
  cartCurrencyCode: string;
  grandTotal: string;
  baseGrandTotal: string;
  subTotal: string;
  baseSubTotal: string;
  taxTotal: string;
  baseTaxTotal: string;
  discountAmount: string;
  baseDiscountAmount: string;
  checkoutMethod: string;
  isGuest: string;
  isActive: string;
  items: Array<CartItem>;
  payment?: selectedPaymentMethodType;
  selectedShippingRate: {
    price: string;
    method: string;
  };
  shippingAddress: ShippingAddressDataType;
};
export type ShippingAddressDataType = {
  id: string;
  addressType: string;
  cartId: string;
  firstName: string;
  lastName: string;
  gender: string;
  companyName: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  defaultAddress: boolean;
};

export type BagistoCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  urlPath?: string;
  updatedAt: string;
};

export type BagistoProduct = {
  name: string;
  longDescription?: string;
  urlKey: string;
  slug?: string;
  path?: string;
  price: ProductPrice;
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type BagistoProductInfo = {
  name: string;
  longDescription?: string;
  urlKey: string;
  slug?: string;
  width: string;
  height: string;
  path?: string;
  metaTitle: string;
  metaDescription: string;
  price: ProductPrice;
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  priceHtml: {
    regularPrice: string;
    currencyCode: string;
    formattedRegularPrice: string;
    finalPrice: string;
    formattedFinalPrice: string;
  };
  variants: Array<ProductVariant>;
  featuredImage: Image;
  images: Array<ImageInfo>;
  productFlats: {
    id: string;
    name: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    width: string;
    height: string;
  }[];
  relatedProducts: RelatedProducts[];
  inventories: {
    qty: string;
  }[];
  configutableData: {
    attributes: ConfigurableProductData[];
    index: ConfigurableProductIndexData[];
  };
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ConfigurableProductIndexData = {
  id: string;
  attributeOptionIds: {
    attributeId: string;
    attributeCode: string;
    attributeOptionId: string;
  }[];
};
export type RealatedImageArray = {
  url: string;
};

export type RelatedProducts = {
  id: string;
  name: string;
  urlKey: string;
  priceHtml: {
    regularPrice: string;
    currencyCode: string;
    finalPrice: string;
  };
  images?: RealatedImageArray[];
};

export type ConfigurableProductData = {
  id: string;
  code: string;
  label: string;
  availableForSale: boolean;
  options: {
    id: string;
    code: string;
    label: string;
    swatchType: string;
    swatchValue: string;
    products: [number];
  }[];
};

export type ProductPrice = {
  value: number;
  currencyCode?: 'USD' | 'EUR' | 'ARS' | string;
  retailPrice?: number;
  salePrice?: number;
  listPrice?: number;
  extendedSalePrice?: number;
  extendedListPrice?: number;
};

export type BagistoCartOperation = {
  data: {
    cartDetail: BagistoCart;
  };
  variables: {
    cartId: string;
  };
};

export type BagistoCreateCartOperation = {
  data: { cartCreate: { cart: BagistoCart } };
};

export type BagistoAddToCartOperation = {
  data: {
    addItemToCart: {
      cart: BagistoCart;
    };
  };
  variables: {
    input: {
      productId: number;
      quantity: number;
      selectedConfigurableOption: number | undefined;
      superAttribute: SuperAttribute[];
    };
  };
};

export type bagistPaymentType = {
  cart: {
    id: string;
    customerEmail: null;
    customerFirstName: null;
    customerLastName: null;
    shippingMethod: string;
    couponCode: null;
    isGift: false;
    itemsCount: 1;
    itemsQty: 1;
    exchangeRate: null;
    globalCurrencyCode: string;
    baseCurrencyCode: string;
    channelCurrencyCode: string;
    cartCurrencyCode: string;
    grandTotal: string;
    baseGrandTotal: string;
    subTotal: string;
    baseSubTotal: string;
    taxTotal: number;
    baseTaxTotal: number;
    discountAmount: number;
    baseDiscountAmount: number;
    checkoutMethod: null;
    isGuest: true;
    isActive: true;
    customerId: null;
    channelId: '1';
    appliedCartRuleIds: null;
    items: [
      {
        id: string;
        quantity: 1;
        sku: string;
        type: string;
        name: string;
        couponCode: null;
        weight: string;
        totalWeight: string;
        baseTotalWeight: string;
        price: string;
        basePrice: string;
        total: string;
        baseTotal: string;
        taxPercent: string;
        taxAmount: string;
        baseTaxAmount: string;
        discountPercent: string;
        discountAmount: string;
        baseDiscountAmount: string;
        parentId: null;
        productId: string;
        cartId: string;
        taxCategoryId: null;
        customPrice: null;
        appliedCartRuleIds: null;

        product: {
          id: string;
          type: string;
          attributeFamilyId: string;
          sku: string;
          parentId: null;
        };
      }
    ];
    formattedPrice: {
      grandTotal: string;
      baseGrandTotal: string;
      subTotal: string;
      baseSubTotal: string;
      taxTotal: string;
      baseTaxTotal: string;
      discount: string;
      baseDiscount: string;
      discountedSubTotal: string;
      baseDiscountedSubTotal: string;
    };
    shippingAddress: null;
    billingAddress: null;
    selectedShippingRate: null;
    payment: {
      id: string;
      method: string;
      methodTitle: string;
      cartId: string;
    };
  };
};

export type SuperAttribute = {
  attributeId: number;
  attributeOptionId: number;
};

export type BagistoRemoveFromCartOperation = {
  data: {
    removeCartItem: {
      cart: BagistoCart;
    };
  };
  variables: {
    lineIds: number;
  };
};

export type BagistoUpdateCartOperation = {
  data: {
    updateItemToCart: {
      cart: BagistoCart;
    };
  };
  variables: {
    input: {
      qty: {
        cartItemId: number;
        quantity: number;
      }[];
    };
  };
};

export type BagistoCollectionOperation = {
  data: {
    allProducts: {
      data: BagistoProductInfo[];
    };
  };
  variables: {
    input: InputData[];
  };
};

export type BagistoCollectionProductsOperation = {
  data: {
    allProducts: {
      data: BagistoProductInfo[];
    };
  };
  variables: {
    input: InputData[];
    reverse?: boolean;
    sortKey?: string;
  };
};

export type InputData = {
  key: string;
  value: string;
};

export type BagistoCollectionsOperation = {
  data: {
    homeCategories: Array<BagistoCollection>;
  };
};

export type BagistoThemeCustomization = {
  data: {
    themeCustomization?: ThemeCustomization[];
  };
  variables: {
    handle: string;
  };
};

export type ThemeCustomization = {
  id: string;
  channelId: string;
  type: string;
  name: string;
  sortOrder: string;
  status: string;
  baseUrl: string;
  translations: {
    id: string;
    themeCustomizationId: string;
    locale: string;
    options: {
      css: string;
      html: string;
      title: string;
      column_1: ThemeOptions[];
      column_2: ThemeOptions[];
      column_3: ThemeOptions[];
      images: {
        link: string;
        image: string;
        imageUrl: string;
      };
      filters: {
        key: string;
        value: string;
      };
    };
  }[];
};

export type BagistoMenuOperation = {
  data: {
    homeCategories?: {
      id: string;
      categoryId: string;
      name: string;
      slug: string;
    }[];
  };
  variables: {
    handle: string;
  };
};

export type ThemeOptions = {
  url: string;
  title: string;
  sortOrder: string;
};

export type BagistoPageOperation = {
  data: { cmsPages: Page };
  variables: {
    input: FilterCmsPageTranslationInput;
  };
};

export type FilterCmsPageTranslationInput = {
  urlKey: string;
};

export type BagistoPagesOperation = {
  data: { cmsPages: Page };
};

export type BagistoProductOperation = {
  data: { product: BagistoProduct };
  variables: {
    handle: string;
  };
};
export type StateArrayDataType = {
  id: string;
  countryCode: string;
  code: string;
  defaultName: string;
  countryId: string;
};

export type CountryArrayDataType = {
  id: string;
  code: string;
  name: string;
  states: StateArrayDataType[];
};

export type BagistoCountriesOperation = {
  data: {
    countries: CountryArrayDataType[];
  };
};

export type ShippingArrayDataType = {
  title: string;
  methods: {
    code: string;
    label: string;
    price: number;
    formattedPrice: string;
    basePrice: number;
    formattedBasePrice: string;
  };
};

export type BagistoCheckoutOperation = {
  data: {
    shippingMethods: ShippingArrayDataType[];
  };
};

export type BagistoProductRecommendationsOperation = {
  data: {
    productRecommendations: BagistoProduct[];
  };
  variables: {
    productId: string;
  };
};

export type BagistoProductsOperation = {
  data: {
    products: Connection<BagistoProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};
