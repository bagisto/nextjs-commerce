export const DELETE_ALL_COMPARE_ITEMS = `
  mutation DeleteAllCompareItems {
    createDeleteAllCompareItems(input: {}) {
      deleteAllCompareItems {
        message
        deletedCount
      }
    }
  }
`;
