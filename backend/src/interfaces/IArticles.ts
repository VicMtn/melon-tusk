export interface IArticlesResponse {
    Data: IArticle[];
    Err: Record<string, never>;
}

export interface IArticle {
    TYPE: string;
    ID: number;
    GUID: string;
    PUBLISHED_ON: number;
    IMAGE_URL: string;
    TITLE: string;
    URL: string;
    SOURCE_ID: number;
    BODY: string;
    KEYWORDS: string;
    LANG: string;
    UPVOTES: number;
    DOWNVOTES: number;
    SCORE: number;
    SENTIMENT: string;
    STATUS: string;
    CREATED_ON: number;
    CREATED_BY: number;
    CREATED_BY_USERNAME: string;
    UPDATED_ON: number;
    UPDATED_BY: number;
    UPDATED_BY_USERNAME: string;
    SOURCE_DATA: IArticleSource;
    CATEGORY_DATA: IArticleCategory[];
}

export interface IArticleSource {
    TYPE: string;
    ID: number;
    SOURCE_KEY: string;
    NAME: string;
    IMAGE_URL: string;
    URL: string;
    LANG: string;
    SOURCE_TYPE: string;
    LAUNCH_DATE: number;
    SORT_ORDER: number;
    CALL_TIMEOUT: number;
    SKIP_ARTICLE_IMAGE: boolean;
    BENCHMARK_SCORE: number;
    STATUS: string;
    LAST_UPDATED_TS: number;
    LAST_ARTICLE_PUBLISHED_AT: number;
    LAST_CALL: number;
    LAST_CALL_SUCCESS: number;
    CREATED_ON: number;
    CREATED_BY: number;
    CREATED_BY_USERNAME: string;
    UPDATED_ON: number;
    UPDATED_BY: number;
    UPDATED_BY_USERNAME: string;
}

export interface IArticleCategory {
    TYPE: string;
    ID: number;
    NAME: string;
    CATEGORY: string;
}



