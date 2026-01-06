import { gql } from "@apollo/client";

export const CREATE_CHECKOUT_ADDRESS = gql`
 mutation createCheckoutAddress(
    $token: String!
    $billingFirstName: String!
    $billingLastName: String!
    $billingEmail: String!
    $billingAddress: String!
    $billingCity: String!
    $billingCountry: String!
    $billingState: String!
    $billingPostcode: String!
    $billingPhoneNumber: String!
    $billingCompanyName : String!
    $useForShipping: Boolean
    $shippingFirstName : String
    $shippingLastName : String
    $shippingAddress : String
    $shippingCity : String
    $shippingCountry : String
    $shippingState : String
    $shippingPostcode : String
    $shippingPhoneNumber :String
    $shippingCompanyName : String
    $shippingEmail : String
) {
  createCheckoutAddress(
    input: {
      token: $token
      billingFirstName: $billingFirstName
      billingLastName: $billingLastName
      billingEmail: $billingEmail
      billingAddress: $billingAddress
      billingCity: $billingCity
      billingCountry: $billingCountry
      billingState: $billingState
      billingPostcode: $billingPostcode
      billingPhoneNumber: $billingPhoneNumber
      billingCompanyName : $billingCompanyName
      useForShipping: $useForShipping
      shippingFirstName : $shippingFirstName
      shippingLastName : $shippingLastName
      shippingAddress : $shippingAddress
      shippingCity : $shippingCity
      shippingEmail : $shippingEmail
      shippingCountry : $shippingCountry
      shippingState : $shippingState
      shippingPostcode : $shippingPostcode
      shippingPhoneNumber : $shippingPhoneNumber
      shippingCompanyName : $shippingCompanyName
    }
  ) {
    checkoutAddress {
      success
      message
      id
      cartToken
    }
  }
}
`;
