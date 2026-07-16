

export interface PageInfo {
  endCursor?: string;
  startCursor?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface CustomerEdge<T> {
  cursor?: string;
  node: T;
}

export interface CustomerConnection<T> {
  edges: CustomerEdge<T>[];
  pageInfo?: PageInfo;
  totalCount?: number;
}


export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phone?: string | null;
  status?: string;
  subscribedToNewsLetter?: boolean;
  isVerified?: string | boolean;
  image?: string | null;
  token?: string;
  /** Computed display name used in the client store / UI. */
  name?: string;
}

export interface UpdateCustomerProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  image?: string;
}


export interface CustomerOrderListNode {
  _id: string;
  incrementId: string;
  status: string;
  channelName: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  shippingMethod: string;
  shippingTitle: string;
  couponCode: string | null;
  totalItemCount: number;
  totalQtyOrdered: number;
  grandTotal: string;
  baseGrandTotal: string;
  subTotal: string;
  baseSubTotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount: string;
  baseCurrencyCode: string;
  orderCurrencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrderItemNode {
  id: string;
  sku: string;
  name: string;
  additional?: string | null;
  qtyOrdered: number;
  qtyShipped: number;
  qtyInvoiced: number;
  qtyCanceled: number;
  qtyRefunded: number;
  price: string;
  total: string;
  basePrice: string;
  baseTotal: string;
}

export interface CustomerOrderAddressNode {
  id: string;
  _id: string;
  addressType: string;
  parentAddressId?: string | null;
  customerId?: string | null;
  cartId?: string | null;
  orderId?: string | null;
  name?: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  useForShipping?: boolean;
  email: string;
  phone: string;
  gender?: string | null;
  vatId?: string | null;
  defaultAddress?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerOrderDetail {
  incrementId: string;
  status: string;
  channelName: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  shippingMethod: string;
  shippingTitle: string;
  /** Not part of the GraphQL selection; rendered with a fallback. */
  paymentTitle?: string | null;
  couponCode: string | null;
  totalItemCount: number;
  totalQtyOrdered: number;
  grandTotal: string;
  baseGrandTotal: string;
  grandTotalInvoiced: string;
  grandTotalRefunded: string;
  subTotal: string;
  baseSubTotal: string;
  taxAmount: string;
  baseTaxAmount: string;
  discountAmount: string;
  baseDiscountAmount: string;
  shippingAmount: string;
  baseShippingAmount: string;
  baseCurrencyCode: string;
  channelCurrencyCode: string;
  orderCurrencyCode: string;
  items: CustomerConnection<CustomerOrderItemNode>;
  addresses: CustomerConnection<CustomerOrderAddressNode>;
  createdAt: string;
  updatedAt: string;
}

export type CustomerOrdersConnection = CustomerConnection<CustomerOrderListNode>;



export interface DownloadableProductOrder {
  _id: string;
  incrementId: string;
  status: string;
}

export interface CustomerDownloadableProductNode {
  _id: string;
  productName: string;
  name: string;
  fileName: string | null;
  type: string;
  downloadBought: number;
  downloadUsed: number;
  downloadCanceled: number;
  status: string;
  downloadUrl: string;
  remainingDownloads: number;
  order: DownloadableProductOrder | null;
  createdAt: string;
  updatedAt: string;
}

export type CustomerDownloadableProductsConnection =
  CustomerConnection<CustomerDownloadableProductNode>;



export interface CustomerReviewProduct {
  id: string;
  _id: string;
  sku: string;
  type: string;
  urlKey: string;
  name: string;
  baseImageUrl: string | null;
}

export interface CustomerReviewNode {
  id: string;
  _id: string;
  title: string;
  comment: string;
  rating: number;
  status: string;
  name: string;
  product: CustomerReviewProduct | null;
  customer: { id: string; _id: string } | null;
  createdAt: string;
  updatedAt: string;
}

export type CustomerReviewsConnection = CustomerConnection<CustomerReviewNode>;



export interface CustomerAddress {
  id: string;
  _id: string;
  addressType?: string;
  companyName?: string | null;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  /** Legacy split-address fields tolerated by the UI / mutations. */
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  vatId?: string | null;
  defaultAddress: boolean;
  useForShipping?: boolean;
  additional?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CustomerAddressesConnection = CustomerConnection<CustomerAddress>;

export interface CreateCustomerAddressInput {
  addressId?: number;
  firstName: string;
  lastName: string;
  email?: string;
  address1?: string;
  address2?: string;
  companyName?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  vatId?: string;
  defaultAddress?: boolean;
  useForShipping?: boolean;
}



export interface WishlistProduct {
  id: string;
  _id?: string;
  name: string;
  price?: string;
  sku?: string;
  type?: string;
  description?: string;
  baseImageUrl?: string | null;
  urlKey?: string;
  minimumPrice?: string;
}

export interface WishlistItemNode {
  id: string;
  _id: string;
  product: WishlistProduct;
  customer?: { id: string; email: string };
  channel?: { id: string; code: string; translation?: { name: string } };
  createdAt?: string;
  updatedAt?: string;
}

export type WishlistConnection = CustomerConnection<WishlistItemNode>;

export interface WishlistIdNode {
  id: string;
  product: { id: string };
}

export type WishlistIdsConnection = CustomerConnection<WishlistIdNode>;



export interface CompareReviewNode {
  name: string;
  id: string;
  title: string;
  rating: number;
}

export interface CompareProduct {
  id: string;
  _id: string;
  sku: string;
  urlKey: string;
  type: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  minimumPrice: string;
  maximumPrice: string;
  guestCheckout: string;
  locale?: string;
  channel?: string;
  baseImageUrl?: string | null;
  reviews?: {
    edges: CustomerEdge<CompareReviewNode>[];
    totalCount: number;
  };
  formattedPrice?: string;
  formattedMinimumPrice?: string;
  formattedMaximumPrice?: string;
}

export interface CompareItemNode {
  id: string;
  _id: string;
  product: CompareProduct;
  customer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    gender?: string | null;
    dateOfBirth?: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type CompareItemsConnection = CustomerConnection<CompareItemNode>;

export interface CompareIdNode {
  id: string;
  product: { id: string };
}

export type CompareIdsConnection = CustomerConnection<CompareIdNode>;


export interface CompareProductView extends CompareProduct {
  compareId: string;
  avgRating: number;
  totalReviews: number;
  formattedMinimumPrice: string;
  formattedPrice: string;
  formattedMaximumPrice: string;
}
