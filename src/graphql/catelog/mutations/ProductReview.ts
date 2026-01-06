import { gql } from "@apollo/client";

export const CREATE_PRODUCT_REVIEW = gql`
mutation CreateProductReview($input: createProductReviewInput!) {
  createProductReview(input: $input) {
    productReview {
      id
      title
      comment
      rating
      name
      status
      attachments
    }
    clientMutationId
  }
}` ; 
