// Category List Types 


// Category Details Types 

export interface ProductOptionNode {
  id: string;
  adminName: string;
  isValid?: boolean; 
}


export interface ProductOptionEdge {
  node: ProductOptionNode;
}


export interface AttributeOptions {
  edges: ProductOptionEdge[];
}


export interface ProductAttribute {
  id: string;
  code: string;
  adminName: string;
  options: AttributeOptions;
}
export type AttributeData = ProductAttribute;


export interface ProductReview {
  id: string;
  rating: number;
  name: string;
  title: string;
  comment: string;
}

export interface ProductReviewEdge {
  node: ProductReview;
}

export interface ProductVariant {
  id: string;
  sku: string;
  baseImageUrl: string;
}

export interface ProductVariantEdge {
  node: ProductVariant;
}

export interface ProductNode {
  id: string;
  sku: string;
  type: string;
  name: string;
  urlKey: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number | string;
  baseImageUrl?: string | null;
  minimumPrice?: number | string | null;

  variants?: {
    edges: ProductVariantEdge[];
  };

  reviews?: {
    edges: ProductReviewEdge[];
  };
}

export interface SingleProductResponse {
  product: ProductNode;
}
