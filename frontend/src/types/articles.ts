export interface NewsArticle {
  TYPE: string;
  ID: number;
  GUID: string;
  PUBLISHED_ON: number;
  IMAGE_URL: string;
  TITLE: string;
  URL: string;
  BODY: string;
  KEYWORDS: string;
  LANG: string;
  SENTIMENT: string;
  SOURCE_DATA: {
    NAME: string;
    IMAGE_URL: string;
    LANG: string;
  };
  CATEGORY_DATA: Array<{
    NAME: string;
    CATEGORY: string;
  }>;
}

export interface NewsResponse {
  Data: NewsArticle[];
  Err: Record<string, never>;
} 