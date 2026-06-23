export interface ThemeTranslationNode {
  id: string;
  themeCustomizationId: string;
  locale: string;
  options: string;
}

export interface ThemeTranslationEdge {
  node: ThemeTranslationNode;
}

export interface ThemeCustomizationNode {
  id: string;
  type: string;
  name: string;
  status: string;
  sortOrder: number;
  themeCode?: string;
  translations: {
    edges: ThemeTranslationEdge[];
  };
}

export interface ThemeCustomizationResponse {
  themeCustomizations: {
    edges: {
      node: ThemeCustomizationNode;
    }[];
  };
}



export interface ThemeOptions {
  title: string;
  url: string;
}
export interface FooterColumns {
  column_1?: ThemeOptions[];
  column_2?: ThemeOptions[];
  column_3?: ThemeOptions[];
}
export interface GetFooterResponse {
  themeCustomizations: ThemeCustomizationConnection;
}

export interface GetFooterVariables {
  type?: string;
}
export interface ThemeCustomizationConnection {
  edges: ThemeCustomizationEdge[];
}

export interface ThemeCustomizationEdge {
  node: ThemeCustomizationFooterNode;
}

export interface ThemeCustomizationFooterNode {
  id: string;
  type: string;
  name: string;
  status: boolean;
  themeCode?: string;
  translations: ThemeCustomizationTranslationConnection;
}
export interface ThemeCustomizationTranslationConnection {
  edges: ThemeCustomizationTranslationEdge[];
}

export interface ThemeCustomizationTranslationNode {
  id: string;
  themeCustomizationId: string;
  locale: string;
  options: string | FooterColumns;
}


export interface ThemeCustomizationTranslationEdge {
  node: ThemeCustomizationTranslationNode;
}
export interface FooterMenuProps {
  menu?: ThemeCustomizationEdge[];
}

export interface ThemeCustomizationResult {
  footer_links: GetFooterResponse | null;
  services_content: GetFooterResponse | null;
}




export interface ImageCarouselOptions {
  images?: Array<{
    title?: string;
    link?: string;
    image?: string;
    imageUrl?: string;
  }>;
}

export interface ProductCarouselOptions {
  title?: string;
  filters: {
    sort?: string;
    limit?: string | number;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface CategoryCarouselOptions {
  filters: Record<string, string | number | boolean | undefined>;
}

export interface StaticContentOptions {
  html: string;
  css?: string;
}

export type RenderableThemeOptions =
  | ImageCarouselOptions
  | ProductCarouselOptions
  | CategoryCarouselOptions
  | StaticContentOptions;




  export interface PageTranslation {
  id: string;
  metaTitle?: string;
  pageTitle?: string;
  urlKey: string;
  htmlContent?: string;
  cmsPageId: string;
}

export interface PageData {
  id: string;
  updatedAt: string;
  translation: PageTranslation;
}
