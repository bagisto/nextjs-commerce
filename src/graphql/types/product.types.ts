/**
 * GraphQL Type Definitions for Products
 * These types match the GraphQL schema and provide type safety
 */

export interface PageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AttributeValue {
  id: string;
  locale?: string;
  channel?: string;
  value?: string;
  textValue?: string;
  attribute: {
    id: string;
    code: string;
  };
}

export interface SuperAttribute {
  id: string;
  code: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  type: string;
  name?: string;
  price?: number;
  attributeValues: {
    edges: Array<{
      node: AttributeValue;
    }>;
  };
}

export interface ProductCore {
  id: string;
  _id: string;
  sku: string;
  type: string;
  name: string;
  urlKey: string;
  status: string;
  price: number;
  specialPrice?: number;
  baseImageUrl: string;
  new: boolean;
  featured: boolean;
  visibleIndividually: boolean;
}

export interface ProductDetailed extends ProductCore {
  createdAt: string;
  updatedAt: string;
  description?: string;
  shortDescription?: string;
  descriptionHtml?: string;
  weight?: number;
  productNumber?: string;
  guestCheckout?: boolean;
  manageStock?: boolean;
  metaTitle?: string;
  metaKeywords?: string;
  taxCategoryId?: string;
  specialPriceFrom?: string;
  specialPriceTo?: string;
  superAttributes: {
    edges: Array<{
      node: SuperAttribute;
    }>;
  };
  attributeValues: {
    edges: Array<{
      node: AttributeValue;
    }>;
  };
  variants?: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  upSells?: {
    edges: Array<{
      node: ProductCore;
    }>;
  };
  crossSells?: {
    edges: Array<{
      node: ProductCore;
    }>;
  };
  relatedProducts?: {
    edges: Array<{
      node: ProductCore;
    }>;
  };
}

export interface ProductEdge {
  node: ProductDetailed;
}

export interface ProductConnection {
  totalCount: number;
  pageInfo: PageInfo;
  edges: ProductEdge[];
}

// Query Variables Types
export interface GetProductsVariables {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  first?: number;
  after?: string;
  before?: string;
  channel?: string;
  locale?: string;
}

export interface GetProductByIdVariables {
  id: string;
}

export interface GetRelatedProductsVariables {
  id: string;
  first?: number;
}

// Query Response Types
export interface GetProductsResponse {
  products: ProductConnection;
}

export interface GetProductByIdResponse {
  product: ProductDetailed;
}

export interface GetRelatedProductsResponse {
  product: {
    id: string;
    _id: string;
    sku: string;
    name: string;
    relatedProducts: {
      edges: Array<{
        node: ProductCore;
      }>;
    };
  };
}

export interface GetProductsPaginationResponse {
  products: {
    totalCount: number;
    pageInfo: PageInfo;
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}
