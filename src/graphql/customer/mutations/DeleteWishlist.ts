export const DELETE_WISHLIST_ITEM = `
  mutation DeleteWishlist($input: deleteWishlistInput!) {
    deleteWishlist(input: $input) {
      wishlist {
        id
        _id
      }
    }
  }
`;
