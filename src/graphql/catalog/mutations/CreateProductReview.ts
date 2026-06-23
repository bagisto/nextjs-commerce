import { gql } from "@apollo/client";

export const CREATE_PRODUCT_REVIEW = gql`
  mutation CreateProductReview($input: createProductReviewInput!) {
    createProductReview(input: $input) {
      productReview {
        id
        name
        title
        rating
        comment
        status
      }
    }
  }
`;
