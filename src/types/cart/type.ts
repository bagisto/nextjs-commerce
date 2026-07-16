export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  baseImage: string | null;
  sku: string;
  quantity: number;
  type: string;
  productUrlKey: string;
  canChangeQty: boolean;
}

export interface CartItemEdge {
  node: CartItem;
  product?: {
    id?: string;
    type?: string;
    name?: string;
    urlKey?: string;
    guestCheckout?: boolean | null;
    sku?: string;
    [key: string]: unknown;
  } | null;
}

export interface CartItemEdgeForModal {
  node: CartItem;
}

export interface CartSummaryView {
  items?: CartItemsConnection;
  itemsQty?: number;
  subtotal?: number;
  taxAmount?: number;
  shippingAmount?: number;
  grandTotal?: number;
  isGuest?: boolean;
  customerEmail?: string | null;
  selectedShippingRate?: string | null;
  selectedShippingRateTitle?: string | null;
  paymentMethod?: string | null;
  paymentMethodTitle?: string | null;
}

export interface CartItemsConnection {
  edges: CartItemEdge[];
}

export interface ReadCart {
  id: string;
  itemsCount: number;
  taxAmount: number;
  grandTotal: number;
  shippingAmount: number;
  selectedShippingRate: string | null;
  subtotal: number;
  itemsQty: number;
  isGuest: boolean;
  items: CartItemsConnection;
  paymentMethod: string | null;
  paymentMethodTitle: string | null;
}

export interface CreateReadCart {
  readCart: ReadCart;
}

export interface GetCartItemData {
  createReadCart: CreateReadCart;
}

export interface ReadCartOperation {
  data: GetCartItemData;
}

export interface AddToCartItem {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  baseImage: string | null;
  sku: string;
  quantity: number;
  type: string;
  productUrlKey: string;
  canChangeQty: boolean;
}

export interface AddToCartItemEdge {
  node: AddToCartItem;
}

export interface AddToCartItemsConnection {
  edges: AddToCartItemEdge[];
}

export interface AddProductInCart {
  id: string;
  cartToken: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  itemsQty: number;
  itemsCount: number;
  isGuest: boolean;
  sessionToken: string;
  success: boolean;
  message: string;
  items: AddToCartItemsConnection;
}

export interface CreateAddProductInCart {
  addProductInCart: AddProductInCart;
}

export interface AddToCartData {
  createAddProductInCart: CreateAddProductInCart;
}

export interface AddToCartVariables {
  cartId?: number | null;
  productId: number;
  quantity: number;
}

export interface AddToCartOperation {
  data: AddToCartData;
  variables: AddToCartVariables;
}

export interface CartToken {
  id: string;
  cartToken: string;
  customerId: string | null;
  success: boolean;
  message: string;
  sessionToken: string;
  isGuest: boolean;
}

export interface CreateCartTokenPayload {
  cartToken: CartToken;
}

export interface CreateCartTokenData {
  createCartToken: CreateCartTokenPayload;
}
export type CreateCartTokenVariables = void;

export interface CreateCartTokenOperation {
  data: CreateCartTokenData;
  variables: CreateCartTokenVariables;
}


export interface MergeCartItem {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  baseImage: string | null;
  sku: string;
  quantity: number;
  type: string;
  productUrlKey: string;
  canChangeQty: boolean;
}

export interface MergeCartItemEdge {
  node: MergeCartItem;
}
export interface MergeCartItemsConnection {
  edges: MergeCartItemEdge[];
}
export interface MergeCart {
  id: string;
  taxAmount: number;
  subtotal: number;
  shippingAmount: number;
  grandTotal: number;
  items: MergeCartItemsConnection;
}
export interface CreateMergeCartPayload {
  mergeCart: MergeCart;
}
export interface CreateMergeCartData {
  createMergeCart: CreateMergeCartPayload;
}
export interface CreateMergeCartVariables {
  cartId: number;
}
export interface CreateMergeCartOperation {
  data: CreateMergeCartData;
  variables: CreateMergeCartVariables;
}

export interface RemoveCartItemNode {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  baseImage: string | null;
  sku: string;
  quantity: number;
  type: string;
  productUrlKey: string;
  canChangeQty: boolean;
}

export interface RemoveCartItemEdge {
  node: RemoveCartItemNode;
}
export interface RemoveCartItemsConnection {
  totalCount: number;
  edges: RemoveCartItemEdge[];
}

export interface RemoveCartItem {
  id: string;
  _id: string;
  cartToken: string;
  taxAmount: number;
  shippingAmount: number;
  subtotal: number;
  grandTotal: number;
  itemsQty: number;
  items: RemoveCartItemsConnection;
}

export interface CreateRemoveCartItemPayload {
  removeCartItem: RemoveCartItem;
}

export interface RemoveCartItemData {
  createRemoveCartItem: CreateRemoveCartItemPayload;
}

export interface RemoveCartItemVariables {
  cartItemId: number;
}

export interface RemoveCartItemOperation {
  data: RemoveCartItemData;
  variables: RemoveCartItemVariables;
}

export interface UpdateCartItemNode {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: number;
  baseImage: string | null;
  sku: string;
  quantity: number;
  type: string;
  productUrlKey: string;
  canChangeQty: boolean;
}

export interface UpdateCartItemEdge {
  node: UpdateCartItemNode;
}

export interface UpdateCartItemsConnection {
  edges: UpdateCartItemEdge[];
}
export interface UpdateCartItem {
  id: string;
  taxAmount: number;
  shippingAmount: number;
  subtotal: number;
  grandTotal: number;
  itemsQty: number;
  items: UpdateCartItemsConnection;
}
export interface CreateUpdateCartItemPayload {
  updateCartItem: UpdateCartItem;
}
export interface UpdateCartItemData {
  createUpdateCartItem: CreateUpdateCartItemPayload;
}
export interface UpdateCartItemVariables {
  cartItemId: number;
  quantity: number;
}
export interface UpdateCartItemOperation {
  data: UpdateCartItemData;
  variables: UpdateCartItemVariables;
}
