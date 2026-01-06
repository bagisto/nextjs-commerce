export interface ProductSectionNode {
  id: string;
  sku: string;
  type: string;
  urlKey?: string;
  name?: string;
  baseImageUrl?: string;
  price?: string | number;
  specialPrice?: string;
  images?: {
    edges: Array<{
      node: {
        publicPath: string;
      };
    }>;
  };
}

export interface ProductNode {
  variants: any;
  id: string;
  sku: string;
  type: string;
  name?: string;
  urlKey?: string;
  description?: string;
  shortDescription?: string;
  specialPrice?: string;
  metaTitle?: string;
  baseImageUrl?: string;
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

export interface ProductSectionNode {
  id: string;
  sku: string;
  type: string;
  urlKey?: string;
  name?: string;
  baseImageUrl?: string;
  minimumPrice?: string | number;
  price?: string | number;
  specialPrice?: string;
  images?: {
    edges: Array<{
      node: {
        publicPath: string;
      };
    }>;
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

export interface ProductReviewNode {
  id: string;
  rating: number;
  name?: string;
  title?: string;
  comment?: string;
}

export interface ProductData {
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
}

export type additionalDataTypes = {
  attribute: any;
  id: string;
  code: string;
  label: string;
  value: null;
  admin_name: string;
  type: string;
};

// Product review

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

export interface ReviewDetailProps {
  reviewDetails: ReviewDatatypes[];
  totalReview: number;
}
