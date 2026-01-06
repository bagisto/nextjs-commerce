import { SVGProps } from "react";

export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<BagistoCart, "lines"> & {
  lines: any;
};


/**
 * Sorting & filtration constants
 */
export type SortFilterItemTypes = {
  key: string;
  title: string;
  slug: string | null;
  sortKey: "name" | "created_at" | "price" | "PRICE";
  reverse: boolean;
  position: string;
};
export type getFilterAttributeTypes = {
  id: number;
  code: string;
  adminName: string;
  type: string;
  isRequired: boolean;
  isUnique: boolean;
  valuePerLocale: boolean;
  valuePerChannel: boolean;
  isFilterable: boolean;
  isConfigurable: boolean;
  isVisibleOnFront: boolean;
  isUserDefined: boolean;
  isComparable: boolean;
  options: {
    id: string;
    adminName: string;
    swatchValue: string;
    sortOrder: number;
    attributeId: string;
    isNew: string;
    isDelete: string;
    position: string;
    translations: {
      id: string;
      locale: string;
      label: string;
      attributeOptionId: string;
    }[];
  }[];
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
    channelId?: string;
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    urlKey: string;
    attributeFamilyId: string;
    shortDescription: string;
    guestCheckout: boolean;
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
    cacheBaseImage: {
      smallImageUrl: string;
      mediumImageUrl: string;
      largeImageUrl: string;
      originalImageUrl: string;
    }[];
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
export type Product = Omit<BagistoProductInfo, "variants" | "images"> & {
  products: ProductDetailsInfo[];
  paginatorInfo: {
    count: number;
    currentPage: number;
    lastPage: number;
    total: number;
  };
};

export type ProductDetailsInfo = Omit<
  BagistoProductInfo,
  "variants" | "images"
> & {
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
  isGuest: boolean;
  isActive: string;
  items: Array<CartItem>;
  product: BagistoProductInfo;
  payment?: selectedPaymentMethodType;
  selectedShippingRate: {
    price: string;
    method: string;
  };
  shippingAddress: AddressDataTypes;
  billingAddress: AddressDataTypes;
};

export type BagistoCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  urlPath?: string;
  updatedAt: string;
  id: string;
  logoPath?: string;
  logoUrl?: string;
  name: string;
  slug: string;
};

export type BagistoCollectionMenus = {
  id: string;
  logoPath?: string;
  logoUrl?: string;
  name: string;
  slug: string;
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
  type: string;
  status: boolean;
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
  shortDescription: string;
  descriptionHtml: string;
  options: ProductOption[];
  cacheGalleryImages: {
    smallImageUrl: string;
    mediumImageUrl: string;
    largeImageUrl: string;
    originalImageUrl: string;
  }[];
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
  type: string;
  priceHtml: {
    regularPrice: string;
    currencyCode: string;
    finalPrice: string;
  };
  images?: RealatedImageArray[];
  cacheGalleryImages: {
    smallImageUrl: string;
    mediumImageUrl: string;
    largeImageUrl: string;
    originalImageUrl: string;
  }[];
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

export type AttributeOptionNode = {
  id: string;
  adminName: string;
  isValid : boolean
};

export type AttributeOptionEdge = {
  node: AttributeOptionNode;
};

export type AttributeData = {
  id: string;
  code: string;
  options: {
    edges: AttributeOptionEdge[];
  };
};

export type ProductPrice = {
  value: number;
  currencyCode?: "USD" | "EUR" | "ARS" | string;
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
export type BagistoAddressDataTypes = {
  data: {
    checkoutAddresses: {
      isGuest: boolean;
      customer: {
        addresses?: AddressDataTypes[];
      };
    };
  };
};

export type AddressDataTypes = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  countryName: string;
  postcode: string;
  email: string;
  country: string;
  addressType: string;
  vatId: string;
  phone: string;
  stateName: string;
  defaultAddress: boolean;
  useForShipping: boolean;
};

export type EditItemTypes = {
  state: boolean;
  type: string;
  address?: AddressDataTypes;
  label: string;
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

export type BagistoUserTypes = {
  customerSignUp: BagistoUserTypes;
  error: {
    message: string;
  };
};

export type BagistoCreateUserOperation = {
  data: {
    createCustomer: {
      customer: BagistoUser;
    };
  };
  variables: {
    input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone?: string;
      gender?: string;
      dateOfBirth?: string;
      status?: string;
      isVerified?: string;
      isSuspended?: string;
      subscribedToNewsLetter?: boolean;
    };
  };
};

export type BagistoUser = {
  id: string;
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  status: string;
  apiToken?: string;
  customerGroupId?: string | null;
  channelId?: string | null;
  subscribedToNewsLetter: boolean;
  isVerified: string;
  isSuspended: string;
  token?: string;
  rememberToken?: string | null;
  name: string;
};

export type SuperAttribute = {
  attributeId: number;
  attributeOptionId: number;
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


export type BagistoCollectionProductsOperation = {
  data: {
    allProducts: {
      data: BagistoProductInfo[];
      paginatorInfo: {
        count: number;
        currentPage: number;
        lastPage: number;
        total: number;
      };
    };
  };
  variables: {
    input: InputData[];
    reverse?: boolean;
    sortKey?: string;
  };
};


export type ThemeCustomizationTypes = {
  id: string;
  themeCode?: string;
  type: string;
  name: string;
  sortOrder: string;
  status: string;
  channelId?: string;
  createdAt: string;
  updatedAt: string;
  translations: TranslationsTypes[];
};

export type TranslationsTypes = {
  id: string;
  themeCustomizationId: number;
  localeCode: string;
  type: string;
  options: OptionDataTypes;
};

export type FilterDataTypes = {
  key: string;
  value: string;
  __typename: string;
};

export type ThemeOptions = {
  url: string;
  title: string;
  sortOrder: string;
};
export type OptionDataTypes = {
  title: string;
  css: string;
  html: string;
  images: ImagesDataType[];
  filters: FilterDataTypes[];
  column_1: ThemeOptions[];
  column_2: ThemeOptions[];
  column_3: ThemeOptions[];
  services: {
    service_icon: string;
    description: string;
    title: string;
  }[];
};

export type ImagesDataType = {
  title: string;
  link: string;
  image: string;
  imageUrl: string;
};

export type BagistoCollectionHomeOperation = {
  data: {
    themeCustomization: Array<ThemeCustomizationTypes>;
  };
};

export type InputData = {
  key: string;
  value: string | number;
};


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
