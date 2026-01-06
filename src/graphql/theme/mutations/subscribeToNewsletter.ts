import { gql } from "@apollo/client";

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($input: createNewsletterSubscriptionInput!) {
    createNewsletterSubscription(input: $input) {
      newsletterSubscription {
        success
        message
      }
    }
  }
`;
