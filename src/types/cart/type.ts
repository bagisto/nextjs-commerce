// Cart Item (node)
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

// GraphQL Edge wrapper
export interface CartItemEdge {
  node: CartItem;
}

// Items connection
export interface CartItemsConnection {
  edges: CartItemEdge[];
}

// Read Cart
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

// createReadCart payload
export interface CreateReadCart {
  readCart: ReadCart;
}

// Mutation response data
export interface GetCartItemData {
  createReadCart: CreateReadCart;
}

export interface GetCartItemVariables {
  token: string;
}

// Full GraphQL operation shape (commonly used with bagistoFetch)
export interface ReadCartOperation {
  data: GetCartItemData;
  variables: GetCartItemVariables;
}


 // Add Product In Cart
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
  token?: string | null;
  cartId?: number | null;
  productId: number;
  quantity: number;
}

export interface AddToCartOperation {
  data: AddToCartData;
  variables: AddToCartVariables;
}

// Guest Cart Token 
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


// Merge Cart

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
  token: string;
  cartId: number;
}
export interface CreateMergeCartOperation {
  data: CreateMergeCartData;
  variables: CreateMergeCartVariables;
}


// Remove Cart Item
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
  token: string;
  cartItemId: number;
}

export interface RemoveCartItemOperation {
  data: RemoveCartItemData;
  variables: RemoveCartItemVariables;
}


// Update Cart Item
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
  token: string;
  cartItemId: number;
  quantity: number;
}
export interface UpdateCartItemOperation {
  data: UpdateCartItemData;
  variables: UpdateCartItemVariables;
}
