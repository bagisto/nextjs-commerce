export const getChannelQuery = /* GraphQL */ `
  query Channel {
    getDefaultChannel {
      id
      code
      name
      description
      hostname
      logoUrl
      faviconUrl
    }
  }
`;
