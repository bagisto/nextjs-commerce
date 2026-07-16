


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

export interface BookingEventTicketTranslation {
  locale: string;
  name: string;
  description: string;
}

export interface ProductBookingEventTicket {
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

export interface AppointmentSlot {
  id: string;
  _id: string;
  bookingProductId: string;
  duration: number;
  breakTime: number;
  sameSlotAllDays: string;
  slots: string;
}

export interface DefaultSlot {
  bookingType: string;
  duration: number | null;
  breakTime: number | null;
  slots: string;
}

export interface TableSlot {
  id: string;
  _id: string;
  bookingProductId: string;
  priceType: string;
  guestLimit: number;
  duration: number;
  breakTime: number;
  preventSchedulingBefore: number;
  sameSlotAllDays: string;
  slots: string;
}

export interface RentalSlot {
  rentingType: string;
  dailyPrice: string;
  hourlyPrice: string;
  slots: string;
}

export interface BookingProduct {
  _id: string;
  type: string;
  location: string;
  availableFrom: string;
  availableTo: string;
  availableEveryWeek?: boolean;
  qty?: number;
  eventTickets?: {
    edges: Array<{ node: ProductBookingEventTicket }>;
  };
  appointmentSlot?: AppointmentSlot;
  tableSlot?: TableSlot;
  rentalSlot?: RentalSlot;
  defaultSlot?: DefaultSlot;
}

export interface BookingSlotItem {
  from: string;
  to: string;
}

export interface BookingSlotGroup {
  slots?: Array<BookingSlotItem | string>;
}

export interface BookingSlotsQueryData {
  bookingSlots?: BookingSlotItem[];
}

export interface RentalBookingSlotsQueryData {
  bookingSlots?: BookingSlotGroup[];
}

export type BookingSelectionData =
  | { type: "appointment" | "table" | "default"; date: string; slot: string }
  | { type: "rental"; renting_type: "daily"; date_from: string; date_to: string }
  | { type: "rental"; renting_type: "hourly"; date: string; slot: string }
  | { qty: Record<string, number> };

export interface BundleOptionProductProduct {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  images?: {
    edges: Array<{ node: { id: string; publicPath: string } }>;
  };
}

export interface BundleOptionProductNode {
  id: string;
  qty: number;
  isDefault: boolean;
  isUserDefined: boolean;
  sortOrder: number;
  product: BundleOptionProductProduct;
}

export interface BundleOptionNode {
  id: string;
  type: string;
  isRequired: boolean;
  sortOrder: number;
  translation: {
    label: string;
  };
  bundleOptionProducts: {
    edges: Array<{ node: BundleOptionProductNode }>;
  };
}

export interface BundleOptionsConnection {
  edges: Array<{ node: BundleOptionNode }>;
}

export interface GroupedAssociatedProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  formattedPrice: string;
  specialPrice: string;
  formattedSpecialPrice: string;
  images?: {
    edges: Array<{ node: { id: string; publicPath: string } }>;
  };
}

export interface GroupedProductNode {
  id: string;
  qty: number;
  sortOrder: number;
  associatedProduct: GroupedAssociatedProduct;
}

export interface GroupedProductsConnection {
  edges: Array<{ node: GroupedProductNode }>;
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

export interface SuperAttributeOption {
  id: string;
  code: string;
  label?: string;
  adminName?: string;
  type?: string;
  swatchType?: string;
  swatchValue?: string;
  options?: Array<{
    id: string;
    label?: string;
    swatchValue?: string;
    products?: number[];
  }>;
}

export interface AttributeValueNode {
  id: string;
  code: string;
  label?: string;
  value?: string | null;
  admin_name?: string;
  type?: string;
  attribute?: {
    id: string;
    code: string;
    adminName?: string;
    type?: string;
    isVisibleOnFront?: string;
  };
}

export interface ProductSwatchReview {
  id: string;
  type: string;
  isSaleable?: string;
  price: number | string | { value?: number; currencyCode?: string } | null;
  minimumPrice?: number | string | null;
  specialPrice?: string;
  priceHtml?: {
    currencyCode?: string;
  };
  superAttributeOptions?: string;
  combinations?: string;
  superAttributes?: {
    edges: Array<{
      node: SuperAttributeOption;
    }>;
  };
  attributeValues?: {
    edges: Array<{
      node: AttributeValueNode;
    }>;
  };
  groupedProducts?: GroupedProductsConnection;
  bundleOptions?: BundleOptionsConnection;
  downloadableLinks?: {
    edges: Array<ProductDownloadableLinkEdge>;
  };
  downloadableSamples?: {
    edges: Array<ProductDownloadableSampleEdge>;
  };
  bookingProducts?: {
    edges: Array<{ node: BookingProduct }>;
  };
}

export interface ProductDownloadableLink {
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

export interface ProductDownloadableSample {
  _id: string;
  type: string;
  file?: string;
  fileUrl?: string;
  url?: string;
  translation: {
    title: string;
  };
}

export interface ProductDownloadableLinkEdge {
  node: ProductDownloadableLink;
}

export interface ProductDownloadableSampleEdge {
  node: ProductDownloadableSample;
}




export interface ProductEdge {
  node: {
    id: string;
    name: string;
    urlKey: string;
    type: string;
    sku: string;
    baseImageUrl?: string;
    minimumPrice?: string;
    specialPrice?: string;
    priceHtml?: {
      regularPrice: string;
      finalPrice: string;
      currencyCode: string;
    };
  };
}

export interface ProductsResponse {
  products: {
    edges: ProductEdge[];
    pageInfo?: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
    totalCount?: number;
  };
}

export interface CategoryEdge {
  node: {
    id: string;
    position?: number;
    logoUrl?: string;
    translation: {
      name: string;
      slug: string;
      description?: string;
    };
  };
}

export interface CategoriesResponse {
  categories: {
    edges: CategoryEdge[];
  };
}

export interface RelatedProductsResponse {
  relatedProducts: {
    edges: ProductEdge[];
  };
}



export interface ReviewInput {
  productId: number;
  title: string;
  comment: string;
  rating: number;
  name: string;
  email: string;
  attachments?: string;
}

export interface ReviewFieldInputs {
  input: ReviewInput;
}

export interface ProductReview {
  id: string;
  name: string;
  title: string;
  rating: number;
  comment: string;
  status: string;
}

export interface CreateProductReviewData {
  createProductReview: {
    success: boolean;
    review: ProductReview;
  };
}

export interface CreateProductReviewVariables {
  input: ReviewInput;
}

export interface CreateProductReviewOperation {
  data: CreateProductReviewData;
  variables: CreateProductReviewVariables;
}
