export interface SingleProductResponse {
  product: ProductNode;
}

export interface ProductSectionNode {
  isSaleable?: string;
  id: string;
  sku: string;
  type: string;
  urlKey?: string;
  name?: string;
  baseImageUrl?: string;
  minimumPrice?: string | number;
  price?: string | number;
  specialPrice?: string;
  priceHtml?: {
    currencyCode?: string;
  };
  images?: {
    edges: Array<{
      node: {
        publicPath: string;
      };
    }>;
  };
}

export interface ProductVariantNode {
  id: string;
  sku: string;
  name?: string;
  price?: number;
  baseImageUrl?: string;
  attributeValues?: {
    edges: Array<{
      node: {
        attribute?: {
          code?: string;
        };
        value?: string;
      };
    }>;
  };
}

export interface ProductDownloadableLinkNode {
  _id: string;
  type: string;
  price: string;
  formattedPrice: string;
  translation: {
    title: string;
  };
  sampleType?: string;
  sampleFile?: string;
  sampleFileUrl?: string;
  sampleUrl?: string;
}

export interface ProductDownloadableSampleNode {
  _id: string;
  type: string;
  file?: string;
  fileUrl?: string;
  url?: string;
  translation: {
    title: string;
  };
}

export interface BookingEventTicketTranslation {
  locale: string;
  name: string;
  description: string;
}

export interface ProductBookingEventTicketNode {
  id: string;
  _id: string;
  bookingProductId: string;
  price: string;
  qty: number;
  specialPrice: string;
  specialPriceFrom?: string;
  specialPriceTo?: string;
  formattedPrice: string;
  formattedSpecialPrice: string;
  translation: BookingEventTicketTranslation;
}

export interface BookingProductNode {
  _id: string;
  type: string;
  location: string;
  availableFrom: string;
  availableTo: string;
  availableEveryWeek?: boolean;
  qty?: number;
  eventTickets?: {
    edges: Array<{ node: ProductBookingEventTicketNode }>;
  };
  appointmentSlot?: any;
  rentalSlot?: any;
  defaultSlot?: any;
  tableSlot?: any;
}

export interface ProductNode {
  categories?: {
    edges: Array<{
      node: {
        _id: string;
        displayMode?: string;
        additional?: string;
        translation: {
          name: string;
          slug: string;
        };
      };
    }>;
  };
  variants: {
    edges: Array<{ node: ProductVariantNode }>;
  };
  id: string;
  sku: string;
  type: string;
  isSaleable?: string;
  name?: string;
  urlKey?: string;
  description?: string;
  shortDescription?: string;
  specialPrice?: string;
  metaTitle?: string;
  baseImageUrl?: string;
  price?: string | number | { value?: number; currencyCode?: string } | null;
  minimumPrice?: string | number;
  priceHtml?: {
    currencyCode?: string;
  };
  superAttributes?: {
    edges: Array<{ node: ProductReviewNode }>;
  };
  reviews?: {
    edges: Array<{ node: ProductReviewNode }>;
  };
  relatedProducts?: {
    edges: Array<{ node: ProductSectionNode }>;
  };
  crossSells?: {
    edges: Array<{ node: ProductSectionNode }>;
  };
  upSells?: {
    edges: Array<{ node: ProductSectionNode }>;
  };
  groupedProducts?: {
    edges: Array<{
      node: {
        id: string;
        qty: number;
        sortOrder: number;
        associatedProduct: {
          id: string;
          name: string;
          sku: string;
          price: string;
          formattedPrice: string;
          specialPrice: string;
          formattedSpecialPrice: string;
          images?: {
            edges: Array<{
              node: {
                id: string;
                publicPath: string;
              };
            }>;
          };
        };
      };
    }>;
  };
  downloadableLinks?: {
    edges: Array<{ node: ProductDownloadableLinkNode }>;
  };
  downloadableSamples?: {
    edges: Array<{ node: ProductDownloadableSampleNode }>;
  };
  bookingProducts?: {
    edges: Array<{ node: BookingProductNode }>;
  };
  images?: {
    edges: Array<{
      node: {
        id: string;
        publicPath: string;
        position: string;
      };
    }>;
  };
}

export interface ProductsResponse {
  products: {
    edges: Array<{ node: ProductNode }>;
    pageInfo: {
      endCursor: string;
      startCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    totalCount: number;
  };
}

export type ProductsSectionProps = {
  title: string;
  description: string;
  products: ProductSectionNode[];
};

export interface ProductFilterAttributeResponse {
  attribute: {
    id: string;
    code: string;
    options: {
      edges: Array<{
        node: {
          id: string;
          adminName: string;
        };
      }>;
    };
  };
}

export interface FilterAttributeOption {
  id: string;
  adminName: string;
}

export interface FilterAttribute {
  id: string;
  code: string;
  adminName: string;
  options: FilterAttributeOption[];
}

export type ProductReview = {
  rating: number;
};

export interface ProductReviewNode {
  __typename: "ProductReview";
  name: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: {
    url: string;
    reviewId: string;
  }[];
  customer?: {
    name: string;
    imageUrl: string;
  };
}

export interface ProductData {
  categories?: {
    edges: Array<{
      node: {
        _id: string;
        displayMode?: string;
        additional?: string;
        translation: {
          name: string;
          slug: string;
        };
      };
    }>;
  };
  urlKey: string;
  variants?: {
    edges?: {
      node?: {
        attributeValues?: {
          edges?: {
            node?: {
              attribute?: {
                code?: string;
              };
              value?: string;
            };
          }[];
        };
        id?: string;
        priceBaseImageUrl?: string;
        name?: string;
        name_id?: string;
        sku?: string;
        type?: string;
        color?: string;
        size?: string;
      };
    }[];
  } | null;
  name?: string;
  price?: { value?: number; currencyCode?: string } | number | null;
  priceHtml?: { currencyCode?: string } | null;
  averageRating?: number;
  type?: string;
  reviewCount?: number;
  minimumPrice?: string;
  specialPrice?: string;
  shortDescription?: string;
  status?: boolean;
  id?: string;
  description?: string;
  configutableData?: {
    attributes?: unknown[];
    index?: unknown[];
  } | null;
  groupedProducts?: {
    edges: Array<{
      node: {
        id: string;
        qty: number;
        sortOrder: number;
        associatedProduct: {
          id: string;
          name: string;
          sku: string;
          price: string;
          formattedPrice: string;
          specialPrice: string;
          formattedSpecialPrice: string;
          images?: {
            edges: Array<{
              node: {
                id: string;
                publicPath: string;
              };
            }>;
          };
        };
      };
    }>;
  };
  downloadableLinks?: {
    edges: Array<{ node: ProductDownloadableLinkNode }>;
  };
  downloadableSamples?: {
    edges: Array<{ node: ProductDownloadableSampleNode }>;
  };
  bookingProducts?: {
    edges: Array<{ node: BookingProductNode }>;
  };
  images?: {
    edges: Array<{
      node: {
        id: string;
        publicPath: string;
        position: string;
      };
    }>;
  };
}

export interface AttributeType {
  isVisibleOnFront: string;
  id: string;
  code: string;
  adminName: string;
  type: string;
  label?: string;
}

export type additionalDataTypes = {
  attribute: AttributeType;
  id: string;
  code: string;
  label: string;
  value: string | null;
  admin_name: string;
  type: string;
};


export interface RatingTypes {
  length?: number;
  value?: number;
  size?: string;
  className?: string;
  onChange?: (value: number) => void;
}

export interface ReviewDatatypes {
  id: string;
  name: string;
  title: string;
  rating: 5;
  status: string;
  comment: string;
  productId: string;
  customerId: string;
  createdAt: string;
  images: {
    url: string;
    reviewId: string;
  }[];
  customer: {
    name: string;
    imageUrl: string;
  };
}
