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



// footer 
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
  menu: ThemeCustomizationEdge[];
}

export interface ThemeCustomizationResult {
  footer_links: GetFooterResponse | null;
  services_content: GetFooterResponse | null;
}

