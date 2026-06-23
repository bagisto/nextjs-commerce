export const MOVE_WISHLIST_TO_CART = `
  mutation MoveWishlistToCart($input: moveWishlistToCartInput!) {
    moveWishlistToCart(input: $input) {
      wishlistToCart {
        message
      }
    }
  }
`;
