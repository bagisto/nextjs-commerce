export const getVariantInfo = (
  isConfigurable: boolean,
  params: string,
  superAttributes: any[],
  index: string
) => {
  if (!isConfigurable) {
    return {
      Instock: false,
      productid: "",
      possibleOptions: {},
      variantAttributes: superAttributes,
    };
  }
  const searchParams = new URLSearchParams(params);
  const indexData: Record<string, Record<string, number>> =
    JSON.parse(index || "{}");

  const selectedAttributes: Record<string, number> = {};

  for (const attr of superAttributes) {
    const value = searchParams.get(attr.code);
    if (value) {
      selectedAttributes[attr.code] = Number(value);
    }
  }

  const possibleOptions: Record<string, number[]> = {};

  for (const attr of superAttributes) {
    // For each attribute, find compatible options by filtering using all OTHER selections
    const otherSelectedAttributes = { ...selectedAttributes };
    delete otherSelectedAttributes[attr.code];

    const compatibleVariants = Object.entries(indexData).filter(([_, attributes]) =>
      Object.entries(otherSelectedAttributes).every(
        ([code, value]) => attributes[code] === value
      )
    );

    possibleOptions[attr.code] = [];
    for (const [, attributes] of compatibleVariants) {
      const val = attributes[attr.code];
      if (val !== undefined && !possibleOptions[attr.code].includes(val)) {
        possibleOptions[attr.code].push(val);
      }
    }
  }

  const variantAttributes = superAttributes.map((attr) => ({
    ...attr,
    options: {
      ...attr.options,
      edges: attr.options.edges.map((edge: any) => ({
        ...edge,
        node: {
          ...edge.node,
          isValid: (() => {
            const otherSelectedAttributes = { ...selectedAttributes };
            delete otherSelectedAttributes[attr.code];
            const hasOtherSelections = Object.keys(otherSelectedAttributes).length > 0;
            return !hasOtherSelections || possibleOptions[attr.code].includes(Number(edge.node.id));
          })(),
        },
      })),
    },
  }));

  const allSelected = superAttributes.every(
    (attr) => selectedAttributes[attr.code] !== undefined
  );

  const matchingVariants = Object.entries(indexData).filter(([_, attributes]) =>
    Object.entries(selectedAttributes).every(
      ([code, value]) => attributes[code] === value
    )
  );

  if (allSelected && matchingVariants.length > 0) {
    return {
      productid: matchingVariants[0][0],
      Instock: true,
      possibleOptions,
      variantAttributes,
    };
  }

  return {
    productid: "",
    Instock: matchingVariants.length > 0,
    possibleOptions,
    variantAttributes,
  };
};
