export interface TreeCategoriesVariables {
  parentId?: number;
}

export interface CategoryNode {
  id: string;
  position: number;
  logoPath?: string | null;
  status: string;
  translations: CategoryTranslationConnection;
  children?: CategoryNode[]; // recursive
}


export interface TreeCategoriesResponse {
  treeCategories: CategoryNode[];
}

export interface CategoryTranslationNode {
  name: string;
  slug: string;
  urlPath: string;
  description?: string | null;
  metaTitle?: string | null;
}
export interface CategoryTranslationEdge {
  node: CategoryTranslationNode;
}

export interface CategoryTranslationConnection {
  edges: CategoryTranslationEdge[];
}
