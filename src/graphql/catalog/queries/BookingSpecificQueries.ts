import { gql } from "@apollo/client";

export const GET_APPOINTMENT_BOOKING_DETAILS = gql`
  query GetAppointmentBookingDetails($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      bookingProducts {
        edges {
          node {
            _id
            type
            location
            availableFrom
            availableTo
            qty
            availableEveryWeek
            appointmentSlot {
              id
              _id
              bookingProductId
              duration
              breakTime
              sameSlotAllDays
              slots
            }
          }
        }
      }
    }
  }
`;

export const GET_TABLE_BOOKING_DETAILS = gql`
  query GetTableBookingDetails($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      bookingProducts {
        edges {
          node {
            _id
            type
            location
            availableFrom
            availableTo
            qty
            availableEveryWeek
            tableSlot {
              id
              _id
              bookingProductId
              priceType
              guestLimit
              duration
              breakTime
              preventSchedulingBefore
              sameSlotAllDays
              slots
            }
          }
        }
      }
    }
  }
`;

export const GET_EVENT_BOOKING_DETAILS = gql`
  query GetEventBookingDetails($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      bookingProducts {
        edges {
          node {
            _id
            type
            location
            availableFrom
            availableTo
            qty
            availableEveryWeek
            eventTickets {
              edges {
                node {
                  id
                  _id
                  bookingProductId
                  price
                  qty
                  specialPrice
                  specialPriceFrom
                  specialPriceTo
                  formattedPrice
                  formattedSpecialPrice
                  translation {
                    locale
                    name
                    description
                  }
                  translations {
                    edges {
                      node {
                        locale
                        name
                        description
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_RENTAL_BOOKING_DETAILS = gql`
  query GetRentalBookingDetails($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      bookingProducts {
        edges {
          node {
            _id
            type
            location
            availableFrom
            availableTo
            qty
            availableEveryWeek
            rentalSlot {
              rentingType
              dailyPrice
              hourlyPrice
              slots
            }
          }
        }
      }
    }
  }
`;

export const GET_DEFAULT_BOOKING_DETAILS = gql`
  query GetDefaultBookingDetails($urlKey: String!) {
    product(urlKey: $urlKey) {
      id
      bookingProducts {
        edges {
          node {
            _id
            type
            location
            availableFrom
            availableTo
            qty
            availableEveryWeek
            defaultSlot {
              bookingType
              duration
              breakTime
              slots
            }
          }
        }
      }
    }
  }
`;

export const GET_BOOKING_SLOTS = gql`
  query GetBookingSlots($id: Int!, $date: String!) {
    bookingSlots(id: $id, date: $date) {
      slotId
      from
      to
      timestamp
      qty
    }
  }
`;

export const GET_RENTAL_BOOKING_SLOTS = gql`
  query GetRentalBookingSlots($id: Int!, $date: String!) {
    bookingSlots(id: $id, date: $date) {
      slotId
      time
      slots
    }
  }
`;
